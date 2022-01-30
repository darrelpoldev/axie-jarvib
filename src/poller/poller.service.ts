/**
 * Data Model Interfaces
 * Libraries
 */
import { ChannelManager, Client, Intents, Channel } from "discord.js";
import { EventEmitter } from "events";
import { selfPing } from "../app-health/app-health.service";
import { createMessageWithEmbeded } from "../discord-commands/discord-commands.service";
import { MissionType, Quests, QuestType } from "../ronin/ronin.interfaces";
import { getAccessToken, getMissionStatsByRoninAddress, getMMRInfoByRoninAddresses, getSLPInfoByRoninAddresses, getTotalSLPByRonin } from "../ronin/ronin.service";
import { Accumulated_SLP, DailyStats, DailyStatusReport, Scholar } from "../scholars/scholars.interface";
import { addAccumulatedSLP, dailyStatusReport } from "../scholars/scholars.repository";
import { addDailyStats, getDailySLPByRoninAddress, getDailyStats, getDailyStatusReport, getScholars, toRoninAddress } from "../scholars/scholars.service";
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
                if ((currentHour == hourToNotify || (process.env.environment != "prod" && process.env.environment != "staging")) && !sent) {
                    const channel = this.discordClient.channels.cache.get(`${process.env.discordChannelId}`);
                    if (channel?.isText()) {
                        if (isProduction()) {
                            channel.send(`Hey <@&${axieScholarRoleId}>(s) here's your daily reset alert. Brought to you by your BOT police, JARVIB.`);
                            //  This is to avoid running the daily status report when in local
                            this.emit(EventTypes.DailyReset);
                        };
                    }
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

        this.on(EventTypes.DailyReset, async () => {
            try {
                const defaultRoninAccountAddress = `${await toClientId(`${process.env.roninAccountAddress}`)}`;
                const defaultRoninAccountPrivateKey = `${process.env.roninAccountPrivateKey}`;
                const accessTokenResponse = await getAccessToken(defaultRoninAccountAddress, defaultRoninAccountPrivateKey);
                if (!accessTokenResponse.data) return; // Can we avoid these kind of defense?
                // const scholars = await (await getScholars()).filter(x => x.id == 2);
                const scholars = await getScholars();
                if (scholars.length == 0) return; // Can we avoid these kind of defense?
                const SLPDetails = await getSLPInfoByRoninAddresses(scholars.map(scholar => scholar.roninaddress));
                //  TODO: Save MMR details to database;
                const MMRDetails = await getMMRInfoByRoninAddresses(scholars.map(scholar => scholar.roninaddress));
                await Promise.all(scholars.map(async (scholar: Scholar) => {
                    const clientAddress = await toClientId(scholar.roninaddress);
                    const SLPInfo = SLPDetails.data.filter((detail: any) => detail["client_id"] == clientAddress).shift();
                    const MMRInfo = MMRDetails.data.filter((detail: any) => detail["client_id"] == clientAddress).shift();
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
                        const scholarAccessToken = await getAccessToken(clientAddress, scholarPrivateKey);
                        if (!accessTokenResponse.data) {
                            console.log(`Unable to fetch scholar's accesstoken.`);
                            return;
                        }; // Can we avoid these kind of defense?

                        const quests: MethodResponse = await getMissionStatsByRoninAddress(scholar.roninaddress, scholarAccessToken.data);
                        if (quests.data) {
                            const quest: Quests[] = <Quests[]>quests.data;
                            const dailyQuest = quest.filter(q => q.quest_type === QuestType.daily).shift();
                            const missions = dailyQuest?.missions;
                            const pvp = missions?.filter(m => m.mission_type === MissionType.pvp).shift();
                            dailyStats.lasttotalwincount = pvp?.progress;
                        }
                    }
                    const result = await addDailyStats(dailyStats);
                    if (result.success) {
                        console.log(`Successfully fetched daily status for ${scholar.name} - ${scholar.roninaddress}`);
                    }
                    else {
                        this.sendMessageToAchievements(`There are some problem fetching daily status for ${scholar.name} - ${scholar.roninaddress}. Please help.`);
                        console.log(`Unable to save daily status for ${scholar.name} - ${scholar.roninaddress}`);
                    }
                })).then(() => {
                    console.log(`Completed consolidating daily statistics...`);
                    this.emit(EventTypes.ReadyForReport);
                }).catch(err => {
                    this.sendMessageToAchievements(`Master, I'm unable to consolidate daily status. Please help. ${err}`);
                    console.log(`Unable to collect daily stats. ${err}`);
                });
            } catch (error) {
                console.log(`Unable to compose daily report...`, error);
                this.sendMessageToAchievements(`I'm failing master. Please check the logs. ${error}`);
            }
        });

        this.on(EventTypes.ReadyForReport, async () => {
            try {
                console.log('here is your daily report');
                const dailyStatusReports = await getDailyStats();
                const utcDate = new Date();
                await Promise.all(dailyStatusReports.map(async (dailyStatusReport: DailyStats, index, reportList) => {
                    //  Send message
                    console.log(`${dailyStatusReport.name}, ${dailyStatusReport.totalslp}`);
                    const embededMessage = createMessageWithEmbeded({
                        title: `${dailyStatusReport.name}`,
                        fields: [
                            {
                                name: `:moneybag: Total SLP`,
                                value: `${dailyStatusReport.totalslp}`,
                                inline: true,
                            },
                            {
                                name: `:white_check_mark: Total Wins`,
                                value: `${dailyStatusReport.lasttotalwincount}`,
                                inline: true,
                            },
                            {
                                name: ':rocket: MMR',
                                value: `${dailyStatusReport.elo}`,
                                inline: true,
                            },
                            {
                                name: ':crown: Rank',
                                value: `${dailyStatusReport.currentrank}`,
                                inline: true,
                            },
                            {
                                name: ':date: Timestamp',
                                value: `${utcDate.toString()}`,
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
