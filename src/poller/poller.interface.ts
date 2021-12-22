export interface IWorker {
    start(): any
    stop(): any
}

export enum EventTypes {
    TICK = "TICK"
}