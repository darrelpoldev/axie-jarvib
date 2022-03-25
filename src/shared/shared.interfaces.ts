export interface MethodResponse {
    success: boolean;
    data: any;
    errorDetails?: ErrorDetail
}

export interface ErrorDetail {
    message: string;
    stack: any
}

export enum ACCOUNTS {
    //  JDWK | ASTRD | ICHMN
    JDWK = "JDWK",
    ASTRD = "ASTRD",
    ICHMN = "ICHMN"
}