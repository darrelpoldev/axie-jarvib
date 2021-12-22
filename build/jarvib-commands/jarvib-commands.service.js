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
            var engine = new poller_service_1.EventPoller();
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
        discordClient.on('messageCreate', function (message) {
            if (message.author.bot)
                return;
            if (!message.content.startsWith(prefix + " "))
                return;
            console.log(message.content);
            var commandBody = message.content.slice(prefix.length);
            var args = commandBody.split(' ');
            var command = args[1];
            var options = args[2];
            if (command === "ping") {
                message.reply("Hello **" + message.author.tag + "**. What can I do for you?");
            }
        });
        discordClient.login(process.env.discordToken);
        return [2 /*return*/];
    });
}); };
exports.startListening = startListening;
