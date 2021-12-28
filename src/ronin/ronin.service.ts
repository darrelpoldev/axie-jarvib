/**
 * Data Model Interfaces
 * Libraries
 */
const axios = require('axios');

/**
 * Call Repository
 */


/**
 * Service Methods
 */
export const getTotalSLPByRonin = async (roninAddress: string) => {
    if (roninAddress == "") return "";
    const scholarDetails = await axios.get(`${process.env.roninSLPEndpoint}/${roninAddress}`);
    return scholarDetails.data;
}