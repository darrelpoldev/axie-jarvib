import { writeToJsonFile } from "../file-system/file-system.service";
import { EventPoller } from "../poller/poller.service";
import { MMR, SLP } from "../ronin/ronin.interfaces";
import { getMMRbyRoninAddress, getAxieAPI, getAccessToken, generateQRCode } from "../ronin/ronin.service";
import { JobScheduler } from "../scheduler/scheduler.service";
import { GetScholarByDiscordId, getScholars } from "../scholars/scholars.service";
import { decryptKey, getHost, toClientId } from "../shared/shared.service";
import { Commands, help } from "./jarvib-commands.interfaces";
import { createMessageWithEmbeded } from "../discord-commands/discord-commands.service";
import { Scholar } from "../scholars/scholars.interface";
import { unlink } from "fs";
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
                footer: { text: `get good ${username}` }
            })
            message.reply({ embeds: [stats] });

        }
        else if (command.toUpperCase() === Commands.GETSLP) {
            const roninAddress = options;
            if (roninAddress === undefined || roninAddress === "") message.reply(`Please provide ronin address`);
            const slpDetails: SLP = await getAxieAPI(roninAddress);
            if (!slpDetails) message.reply(`Unable to fetch SLP details`);

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
                footer: { text: `get good ${username}` }
            })
            message.reply({ embeds: [stats] });
        }
        else if (command.toUpperCase() === Commands.GENERATEMYQR) {
            const discordId = message.author.id;
            const response = await GetScholarByDiscordId(discordId);
            if (response?.data == null) {
                await message.reply(`I can't seem to find you on the list of scholars. Please make sure you've signed your Contract with my master.`);
                return;
            }
            const scholar: Scholar = <Scholar>response?.data;
            const clientId = `${await toClientId(scholar.roninaddress)}`;
            const scholarPrivateKey = await decryptKey(scholar.encryptedprivatekey || "");
            const accessTokenResponse = await getAccessToken(clientId, scholarPrivateKey);
            if (!accessTokenResponse.data) {
                await message.reply(`It appears that I'm unable to generate accesstoken for you. Please try again after a couple of minutes.`);
                return;
            }
            const fileId = `jadewick_qr_${scholar.discordid}_${Math.floor(Math.random() * 1000000)}`;
            const qrCode = await generateQRCode(accessTokenResponse.data, fileId, scholar.name);

            await message.author.send(`Here's your new QR code ${scholar.name}: `);
            message.author.send({
                files: [qrCode]
            });
            await message.reply(`QR Code has been sent to you privately.`);

            //  Unlink file
            setTimeout(() => {
                unlink(qrCode, d => { });
            }, 5 * 1000);
        }
        else {
            message.reply(`The fvck are you saying?`);
        }
    })

    discordClient.login(process.env.discordToken);
}
