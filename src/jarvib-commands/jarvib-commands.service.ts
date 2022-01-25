import { writeToJsonFile } from "../file-system/file-system.service";
import { EventPoller } from "../poller/poller.service";
import { MMR, AxieStats, PvpLog } from "../ronin/ronin.interfaces";
import { getMMRbyRoninAddress, getAxieAPI, getPVPLogs, getPVELogs, getBattleLogs } from "../ronin/ronin.service";
import { JobScheduler } from "../scheduler/scheduler.service";
import { getScholars, getScholar, toRoninAddress } from "../scholars/scholars.service";
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
        else if (command.toUpperCase() === Commands.GETSLP) {
            const roninAddress = options;
            if (roninAddress === undefined || roninAddress === "") message.reply(`Please provide ronin address`);
            const slpDetails: AxieStats = await getAxieAPI(roninAddress);
            if (!slpDetails) message.reply(`Unable to fetch AxieStats`);

            let last_claim = new Date(0)
            last_claim.setUTCSeconds(slpDetails.last_claim)

            let next_claim = new Date(0)
            next_claim.setUTCSeconds(slpDetails.next_claim)

            let time_format = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }

            const stats = createMessageWithEmbeded({
                fields: [
                {
                    name: '🚀 CURRENT',
                    value: `${slpDetails.total_slp}`,
                    inline: true,
                },
                {
                    name: '👑 LIFETIME',
                    value: `${slpDetails.raw_total}`,
                    inline: true,
                },
                {
                    name: ':moneybag: NEXTCLAIM',
                    value: `${next_claim.toLocaleString("en-US", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })}`,
                    inline: true,
                },
                {
                    name: ':moneybag: LASTCLAIM',
                    value: `${last_claim.toLocaleString("en-US", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })}`,
                    inline: true,
                }],
                footer: {text: `get good ${username}`}
            })
            message.reply({embeds: [stats]});

        }
        else if (command.toUpperCase() === Commands.GETSTATS) {

            const discordid: string = message.author.id
            const scholar = await getScholar(discordid);
            const roninAddress = scholar ? scholar.roninaddress : "";

            if (!scholar) message.reply(`Who are you???? :middle_finger:`);

            let today = new Date()

            const slpDetails: AxieStats = await getAxieAPI(roninAddress);
            if (!slpDetails) message.reply(`Unable to fetch AxieStats`);

            let pvpLogs: PvpLog[] = await getPVPLogs(roninAddress);
            pvpLogs = pvpLogs.filter(log => new Date(log.game_started) === today)

            if (!slpDetails) message.reply(`Unable to fetch  PvP logs`);

            let pveLogs: PvpLog[] = await getPVELogs(roninAddress);
            pveLogs = pveLogs.filter(log => new Date(log.game_started) === today)
            if (!slpDetails) message.reply(`Unable to fetch PvE logs`);

            const reducer = (p: number, n: PvpLog) => {
                let winRonin = toRoninAddress(n.winner)
                if (winRonin === roninAddress) return p + 1
                return p
            }

            const pvpWins = pvpLogs.reduce(reducer, 0)
            const pveWins = pveLogs.reduce(reducer, 0)

            const battleLogs = getBattleLogs(pvpLogs);

            const stats = createMessageWithEmbeded({
                fields: [
                {
                    name: ':rocket: C SLP',
                    value: `${slpDetails.total_slp}`,
                    inline: true,
                },
                {
                    name: ':full_moon: L SLP',
                    value: `${slpDetails.raw_total}`,
                    inline: true,
                },
                {
                    name: ':crown: RANK',
                    value: `${slpDetails.rank}`,
                    inline: true,
                },
                {
                    name: ':crossed_swords: MMR',
                    value: `${slpDetails.mmr}`,
                    inline: true,
                },
                {
                    name: ':person_fencing: AD WINS',
                    value: `${pveWins}`,
                    inline: true,
                },
                {
                    name: ':ninja: PVP WINS',
                    value: `${pvpWins}`,
                    inline: true,
                },
                {
                    name: ':notepad_spiral: BTL LOGS',
                    value: `[${battleLogs[0].date}](${battleLogs[0].link})
                            [${battleLogs[1].date}](${battleLogs[1].link})
                            [${battleLogs[0].date}](${battleLogs[2].link})`,
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
