/**
 * Data Model Interfaces
 * Libraries
 */
var CryptoJS = require("crypto-js");

/**
 * Call Repository
 */


/**
 * Service Methods
 */
export const mainnet = 'ronin';

export const isProduction = () => {
    return process.env.environment == "prod";
}

export const getHost = () => {
    return isProduction() ? `${process.env.protocol}://${process.env.host}` : `${process.env.protocol}://${process.env.host}:${process.env.PORT}`;
}

export const axieRequiredHeaders = (authorization?: string) => {
    let headers: any = {};
    headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36";
    headers["content-type"] = "application/json";
    headers["accept-language"] = "en-US,en;q=0.9";
    headers["origin"] = "https://marketplace.axieinfinity.com";
    headers["authority"] = "graphql-gateway.axieinfinity.com";

    if (authorization) {
        headers["authorization"] = `Bearer ${authorization}`;
    }
    let result = {
        headers: headers
    }
    return result;
}


//  Converts "ronin:" to "0x"
export const toClientId = async (clientId: string) => {
    return clientId.replace('ronin:', `0x`);
};

export const decryptKey = async (encryptedKey: string): Promise<string> => {
    if (encryptedKey == "") return "";
    const superSecretKey = `${process.env.cryptojsKey}`;
    var bytes = CryptoJS.AES.decrypt(encryptedKey, superSecretKey);
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}