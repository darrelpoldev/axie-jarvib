/**
 * Data Model Interfaces
 * Libraries
 */
import { ChannelManager, Client, Intents, Channel } from "discord.js";
import { EventEmitter } from "events";
import { selfPing } from "../app-health/app-health.service";
import { getTotalSLPByRonin } from "../ronin/ronin.service";
import { Accumulated_SLP, Scholar } from "../scholars/scholars.interface";
import { getScholars, toRoninAddress } from "../scholars/scholars.service";
import { EventTypes, IWorker } from "./poller.interface";


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
                if (currentHour == hourToNotify && !sent) {
                    const channel = this.discordClient.channels.cache.get('862115684820844544');
                    if (channel?.isText()) {
                        //  channel.send(`Hey <@&${axieScholarRoleId}>(s) here's your daily reset alert. Brought to you by your BOT police, JARVIB.`);
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
            //  this.poll(`${process.env.pollingInterval}`);
        });

        this.on(EventTypes.DailyReset, async () => {
            try {
                const scholars = await getScholars();
                scholars.forEach(async (scholar: Scholar) => {
                    const roninAddress = scholar.roninAddress;
                    const scholarDetails = await getTotalSLPByRonin(roninAddress);
                    const scholarDetail = scholarDetails.shift();
                    const accumulated_SLP: Accumulated_SLP = {
                        id: 0,
                        roninAddress: await toRoninAddress(scholarDetail["client_id"]),
                        createdOn: "",
                        scholarId: 1,
                        total: scholarDetail["total"]
                    };
                    console.log(accumulated_SLP);
                });
            } catch (error) {
                console.log(`Unable to compose daily report...`, error);
            }

            //  Save today's earning (total slp, current MMR, etc.)
            //  Compare to previous day
            //  Notify today's earning of each Scholar
        })

    }

    stop() {
        console.info('polling stops');
    }

    poll(interval: string) {
        setTimeout(() => this.emit(EventTypes.TICK), parseInt(`${interval}`));
    }

}
