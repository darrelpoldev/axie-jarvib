import { writeToJsonFile } from "../file-system/file-system.service";
import { EventPoller } from "../poller/poller.service";
import { MMR } from "../ronin/ronin.interfaces";
import { getMMRbyRoninAddress } from "../ronin/ronin.service";
import { JobScheduler } from "../scheduler/scheduler.service";
import { getScholars } from "../scholars/scholars.service";
import { getHost } from "../shared/shared.service";
import { Commands, help } from "./jarvib-commands.interfaces";
import { createMessageWithEmbeded } from "../discord-commands/discord-commands.service";
const schedule = require('node-schedule');

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
        const engine = new EventPoller(discordClient);
        engine.start();
        //  Please uncomment this to use JobScheduler in the future.
        // const scheduler = new JobScheduler(discordClient);
        // scheduler.start();
        // scheduler.startSelfPingJob();
    });

    discordClient.on('messageCreate', async (message: any) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(`${prefix} `)) return;
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args[1];
        const options = args[2];

        //  if command empty or help show available commands
        if (command === undefined || command === "help") {
            message.reply(help);
            return;
        }

        const username = `${message.author.username}#${message.author.discriminator}`

        //  Refactor to avoid spaghetti code.
        if (command.toUpperCase() === Commands.PING) {
            message.reply(`Hello **${message.author.tag}**. What can I do for you?`);
        }
        else if (command.toUpperCase() === Commands.GETSCHOLARS) {
            message.reply(`Please click the link view the current pool of scholars ${getHost()}/api/v1/scholars`);
        }
        else if (command.toUpperCase() === Commands.GETMMR) {
            const roninAddress = options;
            if (roninAddress === undefined || roninAddress === "") message.reply(`Please provide ronin address`);
            const mmrDetails: MMR = await getMMRbyRoninAddress(roninAddress);
            if (!mmrDetails) message.reply(`Unable to fetch MMR details`);
            
            const stats = createMessageWithEmbeded({
                fields: [
                {
                    name: '🚀 MMR',
                    value: `${mmrDetails.ELO}`,
                    inline: true,
                },
                {
                    name: '👑 rank',
                    value: `${mmrDetails.rank}`,
                    inline: true,
                }],
                footer: {text: `get good ${username}`}
            })
            message.reply({embeds: [stats]});

        }
        else {
            message.reply(`The fvck are you saying?`);
        }
    })

    discordClient.login(process.env.discordToken);
}
