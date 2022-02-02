import QRCode from "easyqrcodejs-nodejs";
import { Missions, MMR, Quests, PvpLog, BattleLog } from "./ronin.interfaces";
import Web3 from "web3";
import { mainnet, axieRequiredHeaders, toClientId } from "../shared/shared.service";
import { MethodResponse } from "../shared/shared.interfaces";
const web3 = new Web3();
const axiosRetry = require('axios-retry');

/**
 * Data Model Interfaces
 * Libraries
 */
const axios = require('axios');
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount: any) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error: any) => {
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    }
});
/**
 * Call Repository
 */


/**
 * Service Methods
 */
export const getAxieAPI = async (roninAddress: string) => {
    try {
        if (roninAddress == "") return "";
        const scholarDetails = await axios.get(`${process.env.axieAPIEndpoint}/${roninAddress}`);
        return scholarDetails.data;
    } catch (errorMessage) {
        console.log(`getAxieAPI ${errorMessage}`);
        return false;
    }
}

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

export const getSLPInfoByRoninAddresses = async (roninAddresses: string[], authorization?: string): Promise<MethodResponse> => {
    const methodResponse: MethodResponse = {
        data: "",
        success: false
    }
    try {
        const roninResponse = await getData(`${process.env.roninSLPEndpoint}/${roninAddresses.toString()}`, authorization);
        const methodResponse: MethodResponse = {
            data: roninResponse,
            success: true
        }
        return methodResponse;
    } catch (error) {
        methodResponse.errorDetails = {
            message: "Unable to get AccessToken",
            stack: error
        }
        return methodResponse;
    }
}

export const getMMRInfoByRoninAddresses = async (roninAddresses: string[], authorization?: string): Promise<MethodResponse> => {
    let methodResponse: MethodResponse = {
        data: "",
        success: false
    }
    try {
        const roninResponse = await getData(`${process.env.roninMMREndpoint}/${roninAddresses.toString()}`, authorization);
        if (roninResponse) {
            const playerMMRInfos = roninResponse.map((itemInfo: any) => {
                const playerMMR = itemInfo.items[1];
                return playerMMR;
            });
            methodResponse.data = playerMMRInfos;
            methodResponse.success = true;
        }
        return methodResponse;
    } catch (error) {
        methodResponse.errorDetails = {
            message: "Unable to get AccessToken",
            stack: error
        }
        return methodResponse;
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

export const getData = async (endpoint: string, authorization?: string): Promise<any> => {
    const { data, status } = await axios.get(endpoint, axieRequiredHeaders(authorization));
    if (status < 200 && status >= 300) {
        throw Error('Axie Infinity API have a problem');
    }
    return data;
};


export const fetchData = async (
    postData: { [key: string]: any }
): Promise<any> => {
    const url = `${process.env.axieGQLEndpoint}`;
    const { data, status } = await axios.post(url, postData, axieRequiredHeaders());

    if (status < 200 && status >= 300) {
        throw Error('Axie Infinity API have a problem');
    }

    return data;
};

export const getAccessToken = async (clientId: string, roninPrivateKey: string): Promise<MethodResponse> => {
    const methodResponse: MethodResponse = {
        data: "",
        success: false
    }
    try {
        const roninClientId = clientId;
        const roninAccountPrivateKey = roninPrivateKey;
        const randomMessageResponse = await getRandomMessage();
        const accessToken = await submitSignature(roninClientId, roninAccountPrivateKey, randomMessageResponse.data);
        const methodResponse: MethodResponse = {
            data: accessToken,
            success: true
        }
        return methodResponse;
    } catch (error) {
        methodResponse.errorDetails = {
            message: "Unable to get AccessToken",
            stack: error
        }
        return methodResponse;
    }

}

export const getRandomMessage = async () => {
    try {
        const response = await fetchData({
            'operationName': "CreateRandomMessage",
            'query': "mutation CreateRandomMessage {\n  createRandomMessage\n}\n",
            'variables': {}
        });
        return {
            status: true,
            data: response.data.createRandomMessage
        }
    } catch (err) {
        console.log(err);
        return {
            data: '',
            status: false
        }
    }
}

export const submitSignature = async (
    accountAddress: string,
    privateKey: string,
    randMessage: string) => {
    try {
        let hexSignature = web3.eth.accounts.sign(randMessage, privateKey);
        const signature = hexSignature['signature'];
        const response = await fetchData({
            "operationName": "CreateAccessTokenWithSignature",
            "variables": { "input": { "mainnet": mainnet, "owner": accountAddress, "message": randMessage, "signature": signature } },
            "query": "mutation CreateAccessTokenWithSignature($input: SignatureInput!) {\n  createAccessTokenWithSignature(input: $input) {\n    newAccount\n    result\n    accessToken\n    __typename\n  }\n}\n"
        });
        return response.data.createAccessTokenWithSignature.accessToken;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getMissionStatsByRoninAddress = async (roninAddress: string, accessToken: string) => {
    const methodResponse: MethodResponse = {
        data: "",
        success: false
    }
    try {
        if (roninAddress == "") return methodResponse;
        const response = await getData(`${process.env.roninMissionStatsEndpoint}/${roninAddress}`, accessToken);
        const quests: Quests[] = <Quests[]>response["items"];
        methodResponse.data = quests;
        methodResponse.success = true;
    } catch (errorMessage) {
        console.log(`getMissionStatsByRoninAddress ${errorMessage}`);
    } finally {
        return methodResponse;
    }
}

export const getPVPLogs = async (roninAddress: string): Promise<PvpLog[]> => {
    if (roninAddress == "") return [];
    try {
        const res = await axios.get(`${process.env.pvpEndpoint}/${roninAddress}`);
        return res.data.battles;
    } catch (errorMessage) {
        console.log(`getPVPLogs ${errorMessage}`);
        return [];
    }
}

export const getPVELogs = async (roninAddress: string): Promise<PvpLog[]> => {
    if (roninAddress == "") return [];
    try {
        const res = await axios.get(`${process.env.pveEndpoint}/${roninAddress}`);
        return res.data.battles;
    } catch (errorMessage) {
        console.log(`getPVPLogs ${errorMessage}`);
        return [];
    }
}

const getBattleLog = (battle: PvpLog): BattleLog => { 
    let date = new Date(battle.game_started).toLocaleString("en-US", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })
    return { 
        link: `${process.env.axieReplayEndpoint}${battle.battle_uuid}`,
        date
    }
}

export const getBattleLogs = (pvpLogs: PvpLog[], returnArr = false): string | BattleLog[] =>  {
    const latest = pvpLogs.slice(0, 3)
    const battleLogs = latest.map(getBattleLog)
    if (returnArr) return battleLogs;

    const btlLogsString = battleLogs.reduce((p,n) => p + `[${n.date}](${n.link})\n`, "");
    return btlLogsString;
}

// convert Access token to QR Code
export const generateQRCode = (accessToken: string, fileId: string, scholarName: string): string => {
    const qrcode = new QRCode({
        text: accessToken,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L,
        quietZone: 15,
        quietZoneColor: "rgba(0,0,0,0)",
        logo: './jadewicklogo.jpg', // your brand logo path that put in the center of qr
        logoWidth: 40,
        logoHeight: 40,
        title: `Generated by JARVIB`,
        titleColor: "#004284",
        titleBackgroundColor: "#fff",
        titleHeight: 20,
        titleTop: 10,
    });
    const fname = `${fileId}-qrcode.png`;
    qrcode.saveImage({
        path: fname
    });
    return fname;
};
