import { MMR } from "./ronin.interfaces";

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
    try {
        if (roninAddress == "") return "";
        const scholarDetails = await axios.get(`${process.env.roninSLPEndpoint}/${roninAddress}`);
        return scholarDetails.data;
    } catch (errorMessage) {
        console.log(`getTotalSLPByRonin ${errorMessage}`);
        return false;
    }
}

export const getMMRbyRoninAddress = async (roninAddress: string) => {
    let result: MMR = {
        ELO: 0,
        rank: 0
    }
    try {
        if (roninAddress == "") return result;
        const response = await axios.get(`${process.env.roninMMREndpoint}/${roninAddress}`);
        const items = response.data[0]["items"];
        const data = items !== undefined ? items : [];
        if (data.length == 0) return result;
        const mmrDetails = data[1];
        const MMR: MMR = {
            ELO: mmrDetails["elo"],
            rank: mmrDetails["rank"]
        }
        result = MMR;
    } catch (errorMessage) {
        console.log(`getTotalSLPByRonin ${errorMessage}`);
    } finally {
        return result;
    }
}