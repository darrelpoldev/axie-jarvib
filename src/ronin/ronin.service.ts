import { MMR } from "./ronin.interfaces";
import Web3 from "web3";
import { mainnet, axieRequiredHeaders, toClientId } from "../shared/shared.service";
import { MethodResponse } from "../shared/shared.interfaces";
const web3 = new Web3();

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

export const getAccessToken = async (roninAddress: string, roninPrivateKey: string): Promise<MethodResponse> => {
    const methodResponse: MethodResponse = {
        data: "",
        success: false
    }
    try {
        const roninAccountAddress = roninAddress;
        const roninAccountPrivateKey = roninPrivateKey;
        const randomMessageResponse = await getRandomMessage();
        const accessToken = await submitSignature(roninAccountAddress, roninAccountPrivateKey, randomMessageResponse.data);
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