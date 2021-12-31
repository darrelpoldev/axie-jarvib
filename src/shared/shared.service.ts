/**
 * Data Model Interfaces
 * Libraries
 */


/**
 * Call Repository
 */


/**
 * Service Methods
 */
export const isProduction = () => {
    return process.env.environment == "prod";
}

export const getHost = () => {
    return isProduction() ? `${process.env.protocol}://${process.env.host}` : `${process.env.protocol}://${process.env.host}:${process.env.PORT}`;
}