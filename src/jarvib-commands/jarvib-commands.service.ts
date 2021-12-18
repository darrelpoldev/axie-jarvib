/**
 * Data Model Interfaces
 * Libraries
 */
const { Client, Intents } = require('discord.js');


/**
 * Call Repository
 */


/**
 * Service Methods
 */

export const startListening = async () => {
    const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });
    discordClient.once('ready', () => {
        console.log('Ready!');
    });
    discordClient.login(process.env.discordToken);
}