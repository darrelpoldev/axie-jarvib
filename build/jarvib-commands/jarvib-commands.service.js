"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startListening = exports.setUpCommands = void 0;
var poller_service_1 = require("../poller/poller.service");
var ronin_service_1 = require("../ronin/ronin.service");
var scholars_service_1 = require("../scholars/scholars.service");
var shared_service_1 = require("../shared/shared.service");
var jarvib_commands_interfaces_1 = require("./jarvib-commands.interfaces");
var discord_commands_service_1 = require("../discord-commands/discord-commands.service");
var fs_1 = require("fs");
var schedule = require('node-schedule');
/**
 * Data Model Interfaces
 * Libraries
 */
var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var SlashCommandBuilder = require('@discordjs/builders').SlashCommandBuilder;
var REST = require('@discordjs/rest').REST;
var Routes = require('discord-api-types/v9').Routes;
var discordCommands = [
    new SlashCommandBuilder().setName('ping').setDescription('Send for a surprise!'),
    new SlashCommandBuilder().setName('jarvib').setDescription('Send for a surprise!'),
].map(function (command) { return command.toJSON(); });
/**
 * Call Repository
 */
/**
 * Service Methods
 */
var setUpCommands = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rest;
    return __generator(this, function (_a) {
        rest = new REST({ version: '9' }).setToken(process.env.discordToken);
        rest.put(Routes.applicationGuildCommands(process.env.discordClientId, process.env.discordGuildId), { body: discordCommands })
            .then(function () {
            console.log('Successfully registered application commands.');
        })
            .catch(function (err) {
            console.log(err);
        });
        return [2 /*return*/];
    });
}); };
exports.setUpCommands = setUpCommands;
var startListening = function () { return __awaiter(void 0, void 0, void 0, function () {
    var discordClient, prefix;
    return __generator(this, function (_a) {
        discordClient = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES
            ]
        });
        prefix = "" + process.env.botPrefix;
        console.log(prefix);
        discordClient.once('ready', function () {
            console.log('Ready!');
            var engine = new poller_service_1.EventPoller(discordClient);
            engine.start();
            //  Please uncomment this to use JobScheduler in the future.
            // const scheduler = new JobScheduler(discordClient);
            // scheduler.start();
            // scheduler.startSelfPingJob();
        });
        discordClient.on('messageCreate', function (message) { return __awaiter(void 0, void 0, void 0, function () {
            var commandBody, args, command, options, username, roninAddress, mmrDetails, stats, discordId, response, scholar, clientId, _a, scholarPrivateKey, accessTokenResponse, fileId, qrCode_1, roninAddress, slpDetails, last_claim, next_claim, time_format, stats, discordid, scholar, roninAddress_1, today_1, slpDetails, pvpLogs, pveLogs, reducer, pvpWins, pveWins, battleLogs, stats;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (message.author.bot)
                            return [2 /*return*/];
                        if (!message.content.startsWith(prefix + " "))
                            return [2 /*return*/];
                        commandBody = message.content.slice(prefix.length);
                        args = commandBody.split(' ');
                        command = args[1];
                        options = args[2];
                        //  if command empty or help show available commands
                        if (command === undefined || command === "help") {
                            message.reply(jarvib_commands_interfaces_1.help);
                            return [2 /*return*/];
                        }
                        username = message.author.username + "#" + message.author.discriminator;
                        if (!(command.toUpperCase() === jarvib_commands_interfaces_1.Commands.PING)) return [3 /*break*/, 1];
                        message.reply("Hello **" + message.author.tag + "**. What can I do for you?");
                        return [3 /*break*/, 24];
                    case 1:
                        if (!(command.toUpperCase() === jarvib_commands_interfaces_1.Commands.GETSCHOLARS)) return [3 /*break*/, 2];
                        message.reply("Please click the link view the current pool of scholars " + shared_service_1.getHost() + "/api/v1/scholars");
                        return [3 /*break*/, 24];
                    case 2:
                        if (!(command.toUpperCase() === jarvib_commands_interfaces_1.Commands.GETMMR)) return [3 /*break*/, 4];
                        roninAddress = options;
                        if (roninAddress === undefined || roninAddress === "")
                            message.reply("Please provide ronin address");
                        return [4 /*yield*/, ronin_service_1.getMMRbyRoninAddress(roninAddress)];
                    case 3:
                        mmrDetails = _b.sent();
                        if (!mmrDetails)
                            message.reply("Unable to fetch MMR details");
                        stats = discord_commands_service_1.createMessageWithEmbeded({
                            fields: [
                                {
                                    name: '🚀 MMR',
                                    value: "" + mmrDetails.ELO,
                                    inline: true,
                                },
                                {
                                    name: '👑 rank',
                                    value: "" + mmrDetails.rank,
                                    inline: true,
                                }
                            ],
                            footer: { text: "get good " + username }
                        });
                        message.reply({ embeds: [stats] });
                        return [3 /*break*/, 24];
                    case 4:
                        if (!(command.toUpperCase() === jarvib_commands_interfaces_1.Commands.GENERATEMYQR)) return [3 /*break*/, 16];
                        discordId = message.author.id;
                        console.log(jarvib_commands_interfaces_1.Commands.GENERATEMYQR);
                        return [4 /*yield*/, scholars_service_1.GetScholarByDiscordId(discordId)];
                    case 5:
                        response = _b.sent();
                        if (!((response === null || response === void 0 ? void 0 : response.data) == null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, message.reply("I can't seem to find you on the list of scholars. Please make sure you've signed your Contract with my master.")];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                    case 7:
                        scholar = response === null || response === void 0 ? void 0 : response.data;
                        _a = "";
                        return [4 /*yield*/, shared_service_1.toClientId(scholar.roninaddress)];
                    case 8:
                        clientId = _a + (_b.sent());
                        return [4 /*yield*/, shared_service_1.decryptKey(scholar.encryptedprivatekey || "")];
                    case 9:
                        scholarPrivateKey = _b.sent();
                        return [4 /*yield*/, ronin_service_1.getAccessToken(clientId, scholarPrivateKey)];
                    case 10:
                        accessTokenResponse = _b.sent();
                        if (!!accessTokenResponse.data) return [3 /*break*/, 12];
                        return [4 /*yield*/, message.reply("It appears that I'm unable to generate accesstoken for you. Please try again after a couple of minutes.")];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                    case 12:
                        fileId = "jadewick_qr_" + scholar.discordid + "_" + Math.floor(Math.random() * 1000000);
                        return [4 /*yield*/, ronin_service_1.generateQRCode(accessTokenResponse.data, fileId, scholar.name)];
                    case 13:
                        qrCode_1 = _b.sent();
                        return [4 /*yield*/, message.author.send("Here's your new QR code " + scholar.name + ": ")];
                    case 14:
                        _b.sent();
                        message.author.send({
                            files: [qrCode_1]
                        });
                        return [4 /*yield*/, message.reply("QR Code has been sent to you privately.")];
                    case 15:
                        _b.sent();
                        //  Unlink file
                        setTimeout(function () {
                            fs_1.unlink(qrCode_1, function (d) { });
                        }, 5 * 1000);
                        return [3 /*break*/, 24];
                    case 16:
                        if (!(command.toUpperCase() === jarvib_commands_interfaces_1.Commands.GETSLP)) return [3 /*break*/, 18];
                        roninAddress = options;
                        if (roninAddress === undefined || roninAddress === "")
                            message.reply("Please provide ronin address");
                        return [4 /*yield*/, ronin_service_1.getAxieAPI(roninAddress)];
                    case 17:
                        slpDetails = _b.sent();
                        if (!slpDetails)
                            message.reply("Unable to fetch AxieStats");
                        last_claim = new Date(0);
                        last_claim.setUTCSeconds(slpDetails.last_claim);
                        next_claim = new Date(0);
                        next_claim.setUTCSeconds(slpDetails.next_claim);
                        time_format = {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        };
                        stats = discord_commands_service_1.createMessageWithEmbeded({
                            fields: [
                                {
                                    name: '🚀 CURRENT',
                                    value: "" + slpDetails.total_slp,
                                    inline: true,
                                },
                                {
                                    name: '👑 LIFETIME',
                                    value: "" + slpDetails.raw_total,
                                    inline: true,
                                },
                                {
                                    name: ':moneybag: NEXTCLAIM',
                                    value: "" + next_claim.toLocaleString("en-US", {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    }),
                                    inline: true,
                                },
                                {
                                    name: ':moneybag: LASTCLAIM',
                                    value: "" + last_claim.toLocaleString("en-US", {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    }),
                                    inline: true,
                                }
                            ],
                            footer: { text: "get good " + username }
                        });
                        message.reply({ embeds: [stats] });
                        return [3 /*break*/, 24];
                    case 18:
                        if (!(command.toUpperCase() === jarvib_commands_interfaces_1.Commands.GETSTATS)) return [3 /*break*/, 23];
                        discordid = message.author.id;
                        return [4 /*yield*/, scholars_service_1.getScholar(discordid)];
                    case 19:
                        scholar = _b.sent();
                        roninAddress_1 = scholar ? scholar.roninaddress : "";
                        if (!scholar) {
                            message.reply("Who are you???? :middle_finger:");
                            return [2 /*return*/];
                        }
                        today_1 = new Date();
                        return [4 /*yield*/, ronin_service_1.getAxieAPI(roninAddress_1)];
                    case 20:
                        slpDetails = _b.sent();
                        if (!slpDetails)
                            message.reply("Unable to fetch AxieStats");
                        return [4 /*yield*/, ronin_service_1.getPVPLogs(roninAddress_1)];
                    case 21:
                        pvpLogs = _b.sent();
                        pvpLogs = pvpLogs.filter(function (log) { return new Date(log.game_started) === today_1; });
                        if (!slpDetails)
                            message.reply("Unable to fetch  PvP logs");
                        return [4 /*yield*/, ronin_service_1.getPVELogs(roninAddress_1)];
                    case 22:
                        pveLogs = _b.sent();
                        pveLogs = pveLogs.filter(function (log) { return new Date(log.game_started) === today_1; });
                        if (!slpDetails)
                            message.reply("Unable to fetch PvE logs");
                        reducer = function (p, n) { return __awaiter(void 0, void 0, void 0, function () {
                            var winRonin;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, scholars_service_1.toRoninAddress(n.winner)];
                                    case 1:
                                        winRonin = _a.sent();
                                        if (winRonin === roninAddress_1)
                                            return [2 /*return*/, p + 1];
                                        return [2 /*return*/, p];
                                }
                            });
                        }); };
                        pvpWins = {} //  pvpLogs.reduce(reducer, 0)
                        ;
                        pveWins = {} //  pveLogs.reduce(reducer, 0)
                        ;
                        battleLogs = ronin_service_1.getBattleLogs(pvpLogs);
                        stats = discord_commands_service_1.createMessageWithEmbeded({
                            fields: [
                                {
                                    name: ':rocket: C SLP',
                                    value: "" + slpDetails.total_slp,
                                    inline: true,
                                },
                                {
                                    name: ':full_moon: L SLP',
                                    value: "" + slpDetails.raw_total,
                                    inline: true,
                                },
                                {
                                    name: ':crown: RANK',
                                    value: "" + slpDetails.rank,
                                    inline: true,
                                },
                                {
                                    name: ':crossed_swords: MMR',
                                    value: "" + slpDetails.mmr,
                                    inline: true,
                                },
                                {
                                    name: ':person_fencing: AD WINS',
                                    value: "" + pveWins,
                                    inline: true,
                                },
                                {
                                    name: ':ninja: PVP WINS',
                                    value: "" + pvpWins,
                                    inline: true,
                                },
                                {
                                    name: ':notepad_spiral: BTL LOGS',
                                    value: battleLogs + ".",
                                    inline: true,
                                }
                            ],
                            footer: { text: "stats for " + username }
                        });
                        message.reply({ embeds: [stats] });
                        return [3 /*break*/, 24];
                    case 23:
                        message.reply("The fvck are you saying?");
                        _b.label = 24;
                    case 24: return [2 /*return*/];
                }
            });
        }); });
        discordClient.login(process.env.discordToken);
        return [2 /*return*/];
    });
}); };
exports.startListening = startListening;
