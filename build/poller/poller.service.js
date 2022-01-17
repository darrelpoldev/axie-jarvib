"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.EventPoller = void 0;
/**
 * Data Model Interfaces
 * Libraries
 */
var discord_js_1 = require("discord.js");
var events_1 = require("events");
var app_health_service_1 = require("../app-health/app-health.service");
var discord_commands_service_1 = require("../discord-commands/discord-commands.service");
var ronin_interfaces_1 = require("../ronin/ronin.interfaces");
var ronin_service_1 = require("../ronin/ronin.service");
var scholars_service_1 = require("../scholars/scholars.service");
var shared_service_1 = require("../shared/shared.service");
var poller_interface_1 = require("./poller.interface");
/**
 * Call Repository
 */
/**
 * Service Methods
 */
var EventPoller = /** @class */ (function (_super) {
    __extends(EventPoller, _super);
    function EventPoller(_discordClient) {
        var _this = _super.call(this) || this;
        _this.discordClient = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES
            ]
        });
        _this.discordClient = _discordClient;
        return _this;
    }
    EventPoller.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sent, axieScholarRoleId;
            var _this = this;
            return __generator(this, function (_a) {
                console.info("polling starts");
                sent = false;
                axieScholarRoleId = process.env.axieScholarRoleId;
                this.poll("" + process.env.pollingInterval);
                this.on(poller_interface_1.EventTypes.TICK, function () { return __awaiter(_this, void 0, void 0, function () {
                    var hourToNotify, utcDate, localDateTime, currentHour, channel;
                    return __generator(this, function (_a) {
                        try {
                            hourToNotify = process.env.hourToNotify || 8;
                            utcDate = new Date();
                            localDateTime = new Date(utcDate.toString());
                            currentHour = localDateTime.getHours();
                            if ((currentHour == hourToNotify || process.env.environment != "prod") && !sent) {
                                channel = this.discordClient.channels.cache.get("" + process.env.discordChannelId);
                                if (channel === null || channel === void 0 ? void 0 : channel.isText()) {
                                    if (shared_service_1.isProduction()) {
                                        channel.send("Hey <@&" + axieScholarRoleId + ">(s) here's your daily reset alert. Brought to you by your BOT police, JARVIB.");
                                    }
                                    ;
                                    this.emit(poller_interface_1.EventTypes.DailyReset);
                                }
                                sent = true;
                            }
                            else if (currentHour != hourToNotify) {
                                sent = false;
                                console.log('resetting sent value to false at...', localDateTime);
                                this.poll("" + process.env.pollingInterval);
                            }
                            else {
                                console.log('checking at...', localDateTime);
                                this.poll("" + process.env.pollingInterval);
                            }
                            app_health_service_1.selfPing();
                        }
                        catch (error) {
                            console.error("Error on " + poller_interface_1.EventTypes.TICK, error);
                        }
                        return [2 /*return*/];
                    });
                }); });
                this.on(poller_interface_1.EventTypes.DailyReset, function () { return __awaiter(_this, void 0, void 0, function () {
                    var defaultRoninAccountAddress, _a, defaultRoninAccountPrivateKey, accessTokenResponse_1, scholars, SLPDetails_1, MMRDetails_1, error_1;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 7, , 8]);
                                _a = "";
                                return [4 /*yield*/, shared_service_1.toClientId("" + process.env.roninAccountAddress)];
                            case 1:
                                defaultRoninAccountAddress = _a + (_b.sent());
                                defaultRoninAccountPrivateKey = "" + process.env.roninAccountPrivateKey;
                                return [4 /*yield*/, ronin_service_1.getAccessToken(defaultRoninAccountAddress, defaultRoninAccountPrivateKey)];
                            case 2:
                                accessTokenResponse_1 = _b.sent();
                                if (!accessTokenResponse_1.data)
                                    return [2 /*return*/]; // Can we avoid these kind of defense?
                                return [4 /*yield*/, scholars_service_1.getScholars()];
                            case 3:
                                scholars = _b.sent();
                                if (scholars.length == 0)
                                    return [2 /*return*/]; // Can we avoid these kind of defense?
                                return [4 /*yield*/, ronin_service_1.getSLPInfoByRoninAddresses(scholars.map(function (scholar) { return scholar.roninaddress; }))];
                            case 4:
                                SLPDetails_1 = _b.sent();
                                return [4 /*yield*/, ronin_service_1.getMMRInfoByRoninAddresses(scholars.map(function (scholar) { return scholar.roninaddress; }))];
                            case 5:
                                MMRDetails_1 = _b.sent();
                                return [4 /*yield*/, Promise.all(scholars.map(function (scholar) { return __awaiter(_this, void 0, void 0, function () {
                                        var clientAddress, SLPInfo, MMRInfo, dailyStats, scholarPrivateKey, scholarAccessToken, quests, quest, dailyQuest, missions, pvp, result;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, shared_service_1.toClientId(scholar.roninaddress)];
                                                case 1:
                                                    clientAddress = _a.sent();
                                                    SLPInfo = SLPDetails_1.data.filter(function (detail) { return detail["client_id"] == clientAddress; }).shift();
                                                    MMRInfo = MMRDetails_1.data.filter(function (detail) { return detail["client_id"] == clientAddress; }).shift();
                                                    dailyStats = {
                                                        scholarid: scholar.id,
                                                        roninaddress: scholar.roninaddress,
                                                        name: scholar.name,
                                                        discordid: scholar.discordid,
                                                        totalslp: SLPInfo["total"],
                                                        currentrank: MMRInfo["rank"],
                                                        elo: MMRInfo["elo"],
                                                        lasttotalwincount: 0
                                                    };
                                                    return [4 /*yield*/, shared_service_1.decryptKey(scholar.encryptedprivatekey || "")];
                                                case 2:
                                                    scholarPrivateKey = _a.sent();
                                                    if (!scholarPrivateKey) return [3 /*break*/, 5];
                                                    return [4 /*yield*/, ronin_service_1.getAccessToken(clientAddress, scholarPrivateKey)];
                                                case 3:
                                                    scholarAccessToken = _a.sent();
                                                    if (!accessTokenResponse_1.data) {
                                                        console.log("Unable to fetch scholar's accesstoken.");
                                                        return [2 /*return*/];
                                                    }
                                                    ; // Can we avoid these kind of defense?
                                                    return [4 /*yield*/, ronin_service_1.getMissionStatsByRoninAddress(scholar.roninaddress, scholarAccessToken.data)];
                                                case 4:
                                                    quests = _a.sent();
                                                    if (quests.data) {
                                                        quest = quests.data;
                                                        dailyQuest = quest.filter(function (q) { return q.quest_type === ronin_interfaces_1.QuestType.daily; }).shift();
                                                        missions = dailyQuest === null || dailyQuest === void 0 ? void 0 : dailyQuest.missions;
                                                        pvp = missions === null || missions === void 0 ? void 0 : missions.filter(function (m) { return m.mission_type === ronin_interfaces_1.MissionType.pvp; }).shift();
                                                        dailyStats.lasttotalwincount = pvp === null || pvp === void 0 ? void 0 : pvp.progress;
                                                    }
                                                    _a.label = 5;
                                                case 5: return [4 /*yield*/, scholars_service_1.addDailyStats(dailyStats)];
                                                case 6:
                                                    result = _a.sent();
                                                    if (result.success) {
                                                        console.log("Successfully fetched daily status for " + scholar.name + " - " + scholar.roninaddress);
                                                    }
                                                    else {
                                                        this.sendMessageToAchievements("There are some problem fetching daily status for " + scholar.name + " - " + scholar.roninaddress + ". Please help.");
                                                        console.log("Unable to save daily status for " + scholar.name + " - " + scholar.roninaddress);
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })).then(function () {
                                        console.log("Completed consolidating daily statistics...");
                                        _this.emit(poller_interface_1.EventTypes.ReadyForReport);
                                    }).catch(function (err) {
                                        _this.sendMessageToAchievements("Master, I'm unable to consolidate daily status. Please help.");
                                        console.log("Unable to collect daily stats. " + err);
                                    })];
                            case 6:
                                _b.sent();
                                return [3 /*break*/, 8];
                            case 7:
                                error_1 = _b.sent();
                                console.log("Unable to compose daily report...", error_1);
                                this.sendMessageToAchievements("I'm failing master. Please check the logs.");
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                this.on(poller_interface_1.EventTypes.ReadyForReport, function () { return __awaiter(_this, void 0, void 0, function () {
                    var dailyStatusReports, utcDate_1, error_2;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                console.log('here is your daily report');
                                return [4 /*yield*/, scholars_service_1.getDailyStats()];
                            case 1:
                                dailyStatusReports = _a.sent();
                                utcDate_1 = new Date();
                                return [4 /*yield*/, Promise.all(dailyStatusReports.map(function (dailyStatusReport, index, reportList) { return __awaiter(_this, void 0, void 0, function () {
                                        var embededMessage;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    //  Send message
                                                    console.log(dailyStatusReport.name + ", " + dailyStatusReport.totalslp);
                                                    embededMessage = discord_commands_service_1.createMessageWithEmbeded({
                                                        title: "" + dailyStatusReport.name,
                                                        fields: [
                                                            {
                                                                name: ":moneybag: Total SLP",
                                                                value: "" + dailyStatusReport.totalslp,
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ":white_check_mark: Total Wins",
                                                                value: "" + dailyStatusReport.lasttotalwincount,
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':rocket: MMR',
                                                                value: "" + dailyStatusReport.elo,
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':crown: Rank',
                                                                value: "" + dailyStatusReport.currentrank,
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':date: Timestamp',
                                                                value: "" + utcDate_1.toString(),
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':receipt: Ronin Address',
                                                                value: "" + dailyStatusReport.roninaddress,
                                                                inline: true,
                                                            }
                                                        ],
                                                        footer: { text: index == (reportList.length - 1) ? "You're the noob of the day! Git good!" : "Thanks for playing. Keep it up!" }
                                                    });
                                                    return [4 /*yield*/, this.sendMessageToAchievements({ embeds: [embededMessage] })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })).then(function (result) {
                                        console.log("Completed today's Report.");
                                        _this.poll("" + process.env.pollingInterval);
                                    }).catch(function (error) {
                                        console.log("Unable to compose daily report...", error);
                                        _this.sendMessageToAchievements("I'm failing master. Please check the logs.");
                                    })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                console.log("EventTypes.ReadyForReport " + error_2);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    EventPoller.prototype.stop = function () {
        console.info('polling stops');
    };
    EventPoller.prototype.poll = function (interval) {
        var _this = this;
        setTimeout(function () { return _this.emit(poller_interface_1.EventTypes.TICK); }, parseInt("" + interval));
    };
    EventPoller.prototype.sendMessageToAchievements = function (messageOrEmbed) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channel = this.discordClient.channels.cache.get("" + process.env.discordChannelId);
                        if (!(channel === null || channel === void 0 ? void 0 : channel.isText())) return [3 /*break*/, 2];
                        return [4 /*yield*/, channel.send(messageOrEmbed)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    EventPoller.prototype.toDiscordMentionByUserId = function (discordId) {
        return "<@" + discordId + ">";
    };
    return EventPoller;
}(events_1.EventEmitter));
exports.EventPoller = EventPoller;
