import { MMR } from "./ronin.interfaces";
import Web3 from "web3";
import { mainnet, reqConfig } from "../shared/shared.service";
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

export const fetchData = async (
    postData: { [key: string]: any }
): Promise<any> => {
    const url = 'https://graphql-gateway.axieinfinity.com/graphql';
    const { data, status } = await axios.post(url, postData, reqConfig);

    if (status < 200 && status >= 300) {
        throw Error('Axie Infinity API have a problem');
    }

    return data;
};

export const getRandomMessage = async () => {
    try {
        const response = await fetchData({
            'operationName': "CreateRandomMessage",
            'query': "mutation CreateRandomMessage {\n  createRandomMessage\n}\n",
            'variables': {}
        });
        return {
            status: true,
            message: response.data.createRandomMessage
        }
    } catch (err) {
        console.log(err);
        return {
            message: '',
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