/**
 * Data Model Interfaces
 * Libraries
 */
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const discordCommands = [
    new SlashCommandBuilder().setName('ping').setDescription('Send for a surprise!'),
    new SlashCommandBuilder().setName('jarvib').setDescription('Send for a surprise!'),
].map(command => command.toJSON());

/**
 * Call Repository
 */


/**
 * Service Methods
 */
export const setUpCommands = async () => {
    const rest = new REST({ version: '9' }).setToken(process.env.discordToken);
    rest.put(Routes.applicationGuildCommands(process.env.discordClientId, process.env.discordGuildId), { body: discordCommands })
        .then(() => {
            console.log('Successfully registered application commands.')
        })
        .catch((err: any) => {
            console.log(err);
        });
};

export const startListening = async () => {
    const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });
    discordClient.once('ready', () => {
        console.log('Ready!');
        setUpCommands();
    });

    discordClient.on('interactionCreate', async (interaction: any) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;
        if (commandName === `ping`) {
            await interaction.reply('PING ina mo!');
        } else if (commandName === "jarvib") {

        }
    })

    discordClient.login(process.env.discordToken);
}