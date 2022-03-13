/**
 * Data Model Interfaces
 * Libraries
 */
import { ChannelManager, Client, Intents, Channel } from "discord.js";
import { EventEmitter } from "events";
import moment from "moment";
import { selfPing } from "../app-health/app-health.service";
import { createMessageWithEmbeded } from "../discord-commands/discord-commands.service";
import { MissionType, Quests, QuestType } from "../ronin/ronin.interfaces";
import { getAccessToken, getMissionStatsByRoninAddress, getMMRInfoByRoninAddresses, getSLPInfoByRoninAddresses, getTotalSLPByRonin } from "../ronin/ronin.service";
import { Accumulated_SLP, DailyStats, DailyStatusReport, Scholar } from "../scholars/scholars.interface";
import { addAccumulatedSLP, dailyStatusReport } from "../scholars/scholars.repository";
import { addDailyStats, getDailySLPByRoninAddress, getDailyStats, getDailyStatsByScholarId, getDailyStatusReport, getScholars, toRoninAddress } from "../scholars/scholars.service";
import { MethodResponse } from "../shared/shared.interfaces";
import { decryptKey, isProduction, toClientId } from "../shared/shared.service";
import { DailyResult, EventTypes, IWorker } from "./poller.interface";


/**
 * Call Repository
 */


/**
 * Service Methods
 */

export class EventPoller extends EventEmitter implements IWorker {
    discordClient: Client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ]
    });
    constructor(_discordClient: Client) {
        super();
        this.discordClient = _discordClient;
    }

    async start() {
        console.info("polling starts");
        let sent = false;
        const axieScholarRoleId = process.env.axieScholarRoleId;
        this.poll(`${process.env.pollingInterval}`);
        this.on(EventTypes.TICK, async () => {
            try {
                const hourToNotify = process.env.hourToNotify || 8;
                const utcDate = new Date();
                const localDateTime = new Date(utcDate.toString());
                const currentHour = localDateTime.getHours();
                if (!process.env.isNotify) {
                    console.log('Daily reset notification is OFF. Please turn it on by setting notify variable to 1');
                    this.poll(`${process.env.pollingInterval}`);
                    return;
                }
                if ((currentHour == hourToNotify || (process.env.environment != "prod" && process.env.environment != "staging")) && !sent) {
                    const channel = this.discordClient.channels.cache.get(`${process.env.discordChannelId}`);
                    if (channel?.isText()) {
                        channel.send(`Hey <@&${axieScholarRoleId}>(s) here's your daily reset alert for ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')}. Brought to you by your BOT police, JARVIB. `);
                    }
                    this.emit(EventTypes.DailyReset, []);
                    sent = true;
                }
                else if (currentHour != hourToNotify) {
                    sent = false;
                    console.log('resetting sent value to false at...', localDateTime);
                    this.poll(`${process.env.pollingInterval}`);
                }
                else {
                    console.log('checking at...', localDateTime);
                    this.poll(`${process.env.pollingInterval}`);
                }
            } catch (error) {
                console.error(`Error on ${EventTypes.TICK}`, error);
            }
        });

        this.on(EventTypes.DailyReset, async (scholarsToReprocess: Scholar[] = []) => {
            try {
                const defaultRoninAccountAddress = `${await toClientId(`${process.env.roninAccountAddress}`)}`;
                const defaultRoninAccountPrivateKey = `${process.env.roninAccountPrivateKey}`;
                const accessTokenResponse = await getAccessToken(defaultRoninAccountAddress, defaultRoninAccountPrivateKey);
                if (!accessTokenResponse.success) {
                    throw (`Unable to contact Ronin API. Will try again after a few minutes.`);
                }
                const scholars = scholarsToReprocess.length == 0 ? await getScholars() : scholarsToReprocess;
                const scholarCount = scholars.length;
                if (scholars.length == 0) throw ("Unable to fetch scholars.");
                await Promise.all(scholars.map(async (scholar: Scholar) => {
                    const dailyStatsRecord = await getDailyStatsByScholarId(scholar.id);
                    if (dailyStatsRecord.success) {
                        console.log(`Status for ${scholar.name} has been fetched before. Skipping to the next scholar...`);
                        return;
                    }
                    const roninAddressArray = [scholar.roninaddress];
                    const SLPDetails = await getSLPInfoByRoninAddresses(roninAddressArray);
                    console.log(`${scholar.name}: SLPDetails - ${SLPDetails.success}`);
                    if (!SLPDetails.success) {
                        console.log(`Unable to fetch SLP details for ${scholar.name}. Skipping to the next scholar...`);
                        //  scholarsToReprocess.push(scholar);
                    }
                    const MMRDetails = await getMMRInfoByRoninAddresses(roninAddressArray);
                    console.log(`${scholar.name}: MMRDetails - ${MMRDetails.success}`);
                    if (!MMRDetails.success) {
                        //  scholarsToReprocess.push(scholar);
                        console.log(`Unable to fetch MMR details for ${scholar.name}. Skipping to the next scholar...`);
                    }
                    const clientAddress = await toClientId(scholar.roninaddress);
                    const SLPInfo = SLPDetails.data.shift();
                    const MMRInfo = MMRDetails.data.shift();

                    const dailyStats: DailyStats = {
                        scholarid: scholar.id,
                        roninaddress: scholar.roninaddress,
                        name: scholar.name,
                        discordid: scholar.discordid,
                        totalslp: SLPInfo["total"],
                        currentrank: MMRInfo["rank"],
                        elo: MMRInfo["elo"],
                        lasttotalwincount: 0
                    };
                    const scholarPrivateKey = await decryptKey(scholar.encryptedprivatekey || "");

                    if (scholarPrivateKey) {
                        console.log(scholar.name, scholar.encryptedprivatekey);
                        const scholarAccessToken = await getAccessToken(clientAddress, scholarPrivateKey);
                        if (!accessTokenResponse.success) {
                            console.log(`Unable to fetch accesstoken for ${scholar.name}. Skipping to the next scholar...`);
                            //  scholarsToReprocess.push(scholar);
                            //  return;
                        }; // Can we avoid these kind of defense?

                        const quests: MethodResponse = await getMissionStatsByRoninAddress(scholar.roninaddress, scholarAccessToken.data);
                        if (quests.success) {
                            const quest: Quests[] = <Quests[]>quests.data;
                            const dailyQuest = quest.filter(q => q.quest_type === QuestType.daily).shift();
                            const missions = dailyQuest?.missions;
                            const pvp = missions?.filter(m => m.mission_type === MissionType.pvp).shift();
                            dailyStats.lasttotalwincount = pvp?.progress;
                        }
                        else {
                            console.log(`Unable to fetch mission stats for ${scholar.name}. Skipping to the next scholar...`);
                            //  scholarsToReprocess.push(scholar);
                            // return;
                        }
                    }
                    const result = await addDailyStats(dailyStats);
                    if (result.success) {
                        console.log(`Successfully fetched daily status for ${scholar.name} - ${scholar.roninaddress}`);
                    }
                    else {
                        console.log(`Unable to save daily status for ${scholar.name} - ${scholar.roninaddress}`);
                        //  return;
                    }
                })).then(() => {
                    if (scholarsToReprocess.length > 0) {
                        const tempScholarsToReprocess = scholarsToReprocess;
                        setTimeout(() => {
                            scholarsToReprocess = [];
                            console.log(`There are scholars that needs to be reprocessed. ${scholars.filter(s => s.name)}`)
                            this.emit(EventTypes.DailyReset, tempScholarsToReprocess);
                        }, 15000);
                    }
                    console.log(`There are no scholars to reprocess. Will now start generating report.`);
                    this.emit(EventTypes.ReadyForReport, scholarCount);
                }).catch((error: any) => {
                    console.log(error);
                    throw ("Something is wrong when fetching daily stats")
                });
            } catch (error: any) {
                console.log('Unable to complete daily status report. Will try again later.', error);
                this.sendMessageToAchievements(`I'm failing master. Please check the logs.`);
                setTimeout(() => {
                    sent = false;
                    this.emit(EventTypes.TICK);
                }, 15000);
            }
        });

        this.on(EventTypes.ReadyForReport, async (scholarCount: number = 0) => {
            try {
                const dailyStatusReports = await getDailyStats();
                if (await dailyStatusReports.length != scholarCount) {
                    console.log('Incomplete report. Refetching scholars.');
                    this.emit(EventTypes.DailyReset, []);
                    return;
                }
                await Promise.all(dailyStatusReports.map(async (dailyStatusReport: DailyStats, index, reportList) => {
                    //  Send message
                    console.log(`${dailyStatusReport.name}, ${dailyStatusReport.totalslp}`);
                    const embededMessage = createMessageWithEmbeded({
                        title: `${dailyStatusReport.name}`,
                        fields: [
                            {
                                name: `:moneybag: Total SLP`,
                                value: `${dailyStatusReport.totalslp || 0}`,
                                inline: true,
                            },
                            {
                                name: `:white_check_mark: Total Wins`,
                                value: `${dailyStatusReport.lasttotalwincount || 0}`,
                                inline: true,
                            },
                            {
                                name: ':rocket: MMR',
                                value: `${dailyStatusReport.elo || 0}`,
                                inline: true,
                            },
                            {
                                name: ':crown: Rank',
                                value: `${dailyStatusReport.currentrank || 0}`,
                                inline: true,
                            },
                            {
                                name: ':date: Timestamp',
                                value: `${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')}`,
                                inline: true,
                            },
                            {
                                name: ':receipt: Ronin Address',
                                value: `${dailyStatusReport.roninaddress}`,
                                inline: true,
                            }],
                        footer: { text: index == (reportList.length - 1) ? `You're the noob of the day! Git good!` : `Thanks for playing. Keep it up!` }
                    });
                    await this.sendMessageToAchievements({ embeds: [embededMessage] });
                })).then((result: any) => {
                    console.log(`Completed today's Report.`);
                    this.poll(`${process.env.pollingInterval}`);
                }).catch((error) => {
                    console.log(`Unable to compose daily report...`, error);
                    this.sendMessageToAchievements(`I'm failing master. Please check the logs. ${error}`);
                });
            } catch (error) {
                console.log(`EventTypes.ReadyForReport ${error}`);
            }
        });
    }

    stop() {
        console.info('polling stops');
    }

    poll(interval: string) {
        setTimeout(() => this.emit(EventTypes.TICK), parseInt(`${interval}`));
    }

    async sendMessageToAchievements(messageOrEmbed: any) {
        const channel = this.discordClient.channels.cache.get(`${process.env.discordChannelId}`);
        if (channel?.isText()) {
            await channel.send(messageOrEmbed);
        }
    }

    toDiscordMentionByUserId(discordId: string) {
        return `<@${discordId}>`
    }

}
