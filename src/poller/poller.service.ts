/**
 * Data Model Interfaces
 * Libraries
 */
import { EventEmitter } from "events";
import { EventTypes, IWorker } from "./poller.interface";


/**
 * Call Repository
 */


/**
 * Service Methods
 */

export class EventPoller extends EventEmitter implements IWorker {
    constructor() {
        super();
    }

    start() {
        console.info("polling starts");
        this.poll(`${process.env.pollingInterval}`);
        this.on(EventTypes.TICK, async () => {
            try {
                const utcDate = new Date();
                const localDateTime = new Date(utcDate.toString());
                console.log('checking...', localDateTime.getHours());
                //  If 8AM, Grab roninaddress details
                //  Then, send discord chat ONCE
            } catch (error) {
                console.error(`Error on ${EventTypes.TICK}`, error);
            }
            this.poll(`${process.env.pollingInterval}`);
        });
    }

    stop() {
        console.info('polling stops');
    }

    poll(interval: string) {
        setTimeout(() => this.emit(EventTypes.TICK), parseInt(`${interval}`));
    }
}
