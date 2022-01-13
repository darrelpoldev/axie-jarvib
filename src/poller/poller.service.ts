/**
 * Data Model Interfaces
 * Libraries
 */
import { ChannelManager, Client, Intents, Channel } from "discord.js";
import { EventEmitter } from "events";
import { selfPing } from "../app-health/app-health.service";
import { getAccessToken, getTotalSLPByRonin } from "../ronin/ronin.service";
import { Accumulated_SLP, DailyStatusReport, Scholar } from "../scholars/scholars.interface";
import { addAccumulatedSLP, dailyStatusReport } from "../scholars/scholars.repository";
import { getDailySLPByRoninAddress, getDailyStatusReport, getScholars, toRoninAddress } from "../scholars/scholars.service";
import { isProduction } from "../shared/shared.service";
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
                if ((currentHour == hourToNotify || process.env.environment != "prod") && !sent) {
                    const channel = this.discordClient.channels.cache.get(`${process.env.discordChannelId}`);
                    if (channel?.isText()) {
                        if (isProduction()) {
                            channel.send(`Hey <@&${axieScholarRoleId}>(s) here's your daily reset alert. Brought to you by your BOT police, JARVIB.`);
                        };
                        this.emit(EventTypes.DailyReset);
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
                selfPing();
            } catch (error) {
                console.error(`Error on ${EventTypes.TICK}`, error);
            }
        });

        this.on(EventTypes.DailyReset, async () => {
            try {
                const accessToken = await getAccessToken();
                console.log(accessToken);
                return;
                const scholars = await getScholars();
                if (scholars.length == 0) return;
                await Promise.all(scholars.map(async (scholar: Scholar) => {
                    const roninAddress = scholar.roninaddress;
                    const scholarDetails = await getTotalSLPByRonin(roninAddress);
                    if (!scholarDetails) return; // This has to be moved or handled somewhere.
                    const scholarDetail = scholarDetails.shift();
                    const accumulated_SLP: Accumulated_SLP = {
                        roninAddress: await toRoninAddress(scholarDetail["client_id"]),
                        scholarId: scholar.id,
                        total: scholarDetail["total"]
                    };
                    const result = await addAccumulatedSLP(accumulated_SLP);
                    if (result) {
                        console.log(`Successfully fetched latest record for ${roninAddress}`);
                    }
                })).then(result => {
                    console.log(`Completed collecting accumulated SLPs...`);
                    this.emit(EventTypes.ReadyForReport);
                }).catch((error: any) => {
                    this.sendMessageToAchievements(`I'm failing master. Please check the logs.`);
                    console.log(`Unable to collect accumulated SLPs. ${error}`);
                });
            } catch (error) {
                console.log(`Unable to compose daily report...`, error);
                this.sendMessageToAchievements(`I'm failing master. Please check the logs.`);
            }
        });

        this.on(EventTypes.ReadyForReport, async () => {
            try {
                const dailyStatusReports = await getDailyStatusReport();
                await Promise.all(dailyStatusReports.map(async (dailyStatusReport: DailyStatusReport) => {
                    //  Send message
                    console.log(`${dailyStatusReport.name}, ${dailyStatusReport.farmedslpfromyesterday}`);
                    await this.sendMessageToAchievements(`Hey ${this.toDiscordMentionByUserId(dailyStatusReport.discordid)}. You farmed ${dailyStatusReport.farmedslpfromyesterday} SLPs today.`)
                })).then((result: any) => {
                    console.log(`Completed today's Report.`);
                    this.poll(`${process.env.pollingInterval}`);
                }).catch((error) => {
                    console.log(`Unable to compose daily report...`, error);
                    this.sendMessageToAchievements(`I'm failing master. Please check the logs.`);
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

    async sendMessageToAchievements(message: string) {
        if (!isProduction()) return;
        const channel = this.discordClient.channels.cache.get(`${process.env.discordChannelId}`);
        if (channel?.isText()) {
            channel.send(message);
        }
    }

    toDiscordMentionByUserId(discordId: string) {
        return `<@${discordId}>`
    }

}
