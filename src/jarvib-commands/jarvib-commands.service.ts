import { EventPoller } from "../poller/poller.service";

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
    const discordClient = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ]
    });
    const prefix = `${process.env.botPrefix}`;
    console.log(prefix);
    discordClient.once('ready', () => {
        console.log('Ready!');
        const engine = new EventPoller();
        engine.start();

        //  setUpCommands();
    });

    // discordClient.on('interactionCreate', async (interaction: any) => {
    //     if (!interaction.isCommand()) return;

    //     const { commandName } = interaction;
    //     if (commandName === `ping`) {
    //         await interaction.reply('PING ina mo!');
    //     } else if (commandName === "jarvib") {

    //     }
    // });

    discordClient.on('messageCreate', (message: any) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(`${prefix} `)) return;
        console.log(message.content);
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args[1];
        const options = args[2];
        if (command === "ping") {
            message.reply(`Hello **${message.author.tag}**. What can I do for you?`);
        }
    })

    discordClient.login(process.env.discordToken);
}