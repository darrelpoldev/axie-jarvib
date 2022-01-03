/**
 * Data Model Interfaces
 * Libraries
 */
import { ChannelManager, Client, Intents, Channel } from "discord.js";
import { EventEmitter } from "events";
import { selfPing } from "../app-health/app-health.service";
import { getTotalSLPByRonin } from "../ronin/ronin.service";
import { Accumulated_SLP, DailyStatusReport, Scholar } from "../scholars/scholars.interface";
import { addAccumulatedSLP } from "../scholars/scholars.repository";
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
                    const channel = this.discordClient.channels.cache.get('862115684820844544');
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
                }
                else {
                    console.log('checking at...', localDateTime);
                }
                selfPing();
            } catch (error) {
                console.error(`Error on ${EventTypes.TICK}`, error);
            }
            this.poll(`${process.env.pollingInterval}`);
        });

        this.on(EventTypes.DailyReset, async () => {
            try {
                const scholars = await getScholars();
                if (scholars.length == 0) return;
                const collectAccumulatedSLP = new Promise((resolve: any, reject) => {
                    scholars.forEach(async (scholar: Scholar, index, scholarList) => {
                        const roninAddress = scholar.roninaddress;
                        const scholarDetails = await getTotalSLPByRonin(roninAddress);
                        if (!scholarDetails) return; // This has to be moved or handled somewhere.
                        const scholarDetail = scholarDetails.shift();
                        const accumulated_SLP: Accumulated_SLP = {
                            roninAddress: await toRoninAddress(scholarDetail["client_id"]),
                            scholarId: scholar.id,
                            total: scholarDetail["total"]
                        };
                        //  This needs some refactoring.
                        const result = !isProduction() ? true : await addAccumulatedSLP(accumulated_SLP);
                        if (result) {
                            console.log(`Successfully fetched latest record for ${roninAddress}`);
                        }
                        if (index === scholarList.length - 1) resolve();
                    });
                });

                collectAccumulatedSLP.then(x => {
                    //  Send message link to summary
                    console.log(`Completed collecting accumulated SLPs...`);
                    this.emit(EventTypes.ReadyForReport, scholars);
                });

                collectAccumulatedSLP.catch(err => {
                    this.sendMessageToAchievements(`I'm failing master. Please check the logs.`);
                    console.log(`Unable to collect accumulated SLPs. ${err}`);
                });

            } catch (error) {
                console.log(`Unable to compose daily report...`, error);
                this.sendMessageToAchievements(`I'm failing master. Please check the logs.`);
            }

            //  Compare to previous day
            //  Notify today's earning of each Scholar
        });

        this.on(EventTypes.ReadyForReport, async (scholars: Scholar[]) => {
            try {
                const dailyStatusReports = await getDailyStatusReport();
                const promise = new Promise((resolve: any, reject) => {
                    dailyStatusReports.forEach(async (dailyStatusReport: DailyStatusReport, index, dailyStatusReportList) => {
                        //  Send message
                        console.log(`${dailyStatusReport.name}, ${dailyStatusReport.farmedslpfromyesterday}`);
                        await this.sendMessageToAchievements(`Hey ${this.toDiscordMentionByUserId(dailyStatusReport.discordid)}. You farmed ${dailyStatusReport.farmedslpfromyesterday} SLPs today.`)
                        if (index === dailyStatusReportList.length - 1) resolve();
                    });
                });

                promise.then(x => {
                    //  Send message link to summary
                    console.log(`Completed today's Report.`);
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
