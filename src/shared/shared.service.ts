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