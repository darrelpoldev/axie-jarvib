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
export const mainnet = 'ronin';

export const isProduction = () => {
    return process.env.environment == "prod";
}

export const getHost = () => {
    return isProduction() ? `${process.env.protocol}://${process.env.host}` : `${process.env.protocol}://${process.env.host}:${process.env.PORT}`;
}

export const reqConfig = {
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        "content-type": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "origin": "https://marketplace.axieinfinity.com",
        "authority": "graphql-gateway.axieinfinity.com"
    }
};


//  Converts "ronin:" to "0x"
export const toClientId = async (clientId: string) => {
    return clientId.replace('ronin:', `0x`);
};