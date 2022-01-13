export interface MethodResponse {
    success: boolean;
    data: any;
    errorDetails?: ErrorDetail
}

export interface ErrorDetail {
    message: string;
    stack: any
}
