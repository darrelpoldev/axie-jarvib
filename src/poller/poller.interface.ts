export interface IWorker {
    start(): any
    stop(): any
}

export enum EventTypes {
    TICK = "TICK",
    DailyReset = "DailyReset",
    ReadyForReport = "ReadyForReport"
}

export interface DailyResult {
    roninAddress: string,
    dailySLP: number
}