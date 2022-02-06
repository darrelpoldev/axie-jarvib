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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPoller = void 0;
/**
 * Data Model Interfaces
 * Libraries
 */
var discord_js_1 = require("discord.js");
var events_1 = require("events");
var moment_1 = __importDefault(require("moment"));
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
                            if ((currentHour == hourToNotify || (process.env.environment != "prod" && process.env.environment != "staging")) && !sent) {
                                channel = this.discordClient.channels.cache.get("" + process.env.discordChannelId);
                                if (channel === null || channel === void 0 ? void 0 : channel.isText()) {
                                    channel.send("Hey <@&" + axieScholarRoleId + ">(s) here's your daily reset alert for " + moment_1.default(Date.now()).format('MMMM Do YYYY, h:mm:ss a') + ". Brought to you by your BOT police, JARVIB. ");
                                }
                                this.emit(poller_interface_1.EventTypes.DailyReset, []);
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
                        }
                        catch (error) {
                            console.error("Error on " + poller_interface_1.EventTypes.TICK, error);
                        }
                        return [2 /*return*/];
                    });
                }); });
                //  New logic
                //  1.
                //  2. 
                this.on(poller_interface_1.EventTypes.DailyReset, function (scholarsToReprocess) {
                    if (scholarsToReprocess === void 0) { scholarsToReprocess = []; }
                    return __awaiter(_this, void 0, void 0, function () {
                        var defaultRoninAccountAddress, _a, defaultRoninAccountPrivateKey, accessTokenResponse_1, scholars_1, _b, error_1;
                        var _this = this;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 7, , 8]);
                                    _a = "";
                                    return [4 /*yield*/, shared_service_1.toClientId("" + process.env.roninAccountAddress)];
                                case 1:
                                    defaultRoninAccountAddress = _a + (_c.sent());
                                    defaultRoninAccountPrivateKey = "" + process.env.roninAccountPrivateKey;
                                    return [4 /*yield*/, ronin_service_1.getAccessToken(defaultRoninAccountAddress, defaultRoninAccountPrivateKey)];
                                case 2:
                                    accessTokenResponse_1 = _c.sent();
                                    if (!accessTokenResponse_1.success) {
                                        throw ("Unable to contact Ronin API. Will try again after a few minutes.");
                                    }
                                    if (!(scholarsToReprocess.length == 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, scholars_service_1.getScholars()];
                                case 3:
                                    _b = _c.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    _b = scholarsToReprocess;
                                    _c.label = 5;
                                case 5:
                                    scholars_1 = _b;
                                    if (scholars_1.length == 0)
                                        throw ("Unable to fetch scholars.");
                                    return [4 /*yield*/, Promise.all(scholars_1.map(function (scholar) { return __awaiter(_this, void 0, void 0, function () {
                                            var dailyStatsRecord, roninAddressArray, SLPDetails, MMRDetails, clientAddress, SLPInfo, MMRInfo, dailyStats, scholarPrivateKey, scholarAccessToken, quests, quest, dailyQuest, missions, pvp, result;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, scholars_service_1.getDailyStatsByScholarId(scholar.id)];
                                                    case 1:
                                                        dailyStatsRecord = _a.sent();
                                                        if (dailyStatsRecord.success) {
                                                            console.log("Status for " + scholar.name + " has been fetched before. Skipping to the next scholar...");
                                                            return [2 /*return*/];
                                                        }
                                                        roninAddressArray = [scholar.roninaddress];
                                                        return [4 /*yield*/, ronin_service_1.getSLPInfoByRoninAddresses(roninAddressArray)];
                                                    case 2:
                                                        SLPDetails = _a.sent();
                                                        console.log(scholar.name + ": SLPDetails - " + SLPDetails.success);
                                                        if (!SLPDetails.success) {
                                                            console.log("Unable to fetch SLP details for " + scholar.name + ". Skipping to the next scholar...");
                                                            scholarsToReprocess.push(scholar);
                                                            return [2 /*return*/];
                                                        }
                                                        return [4 /*yield*/, ronin_service_1.getMMRInfoByRoninAddresses(roninAddressArray)];
                                                    case 3:
                                                        MMRDetails = _a.sent();
                                                        console.log(scholar.name + ": MMRDetails - " + MMRDetails.success);
                                                        if (!MMRDetails.success) {
                                                            scholarsToReprocess.push(scholar);
                                                            console.log("Unable to fetch MMR details for " + scholar.name + ". Skipping to the next scholar...");
                                                            return [2 /*return*/];
                                                        }
                                                        return [4 /*yield*/, shared_service_1.toClientId(scholar.roninaddress)];
                                                    case 4:
                                                        clientAddress = _a.sent();
                                                        SLPInfo = SLPDetails.data.shift();
                                                        MMRInfo = MMRDetails.data.shift();
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
                                                    case 5:
                                                        scholarPrivateKey = _a.sent();
                                                        if (!scholarPrivateKey) return [3 /*break*/, 8];
                                                        console.log(scholar.name, scholar.encryptedprivatekey);
                                                        return [4 /*yield*/, ronin_service_1.getAccessToken(clientAddress, scholarPrivateKey)];
                                                    case 6:
                                                        scholarAccessToken = _a.sent();
                                                        if (!accessTokenResponse_1.success) {
                                                            console.log("Unable to fetch accesstoken for " + scholar.name + ". Skipping to the next scholar...");
                                                            scholarsToReprocess.push(scholar);
                                                            return [2 /*return*/];
                                                        }
                                                        ; // Can we avoid these kind of defense?
                                                        return [4 /*yield*/, ronin_service_1.getMissionStatsByRoninAddress(scholar.roninaddress, scholarAccessToken.data)];
                                                    case 7:
                                                        quests = _a.sent();
                                                        if (quests.success) {
                                                            quest = quests.data;
                                                            dailyQuest = quest.filter(function (q) { return q.quest_type === ronin_interfaces_1.QuestType.daily; }).shift();
                                                            missions = dailyQuest === null || dailyQuest === void 0 ? void 0 : dailyQuest.missions;
                                                            pvp = missions === null || missions === void 0 ? void 0 : missions.filter(function (m) { return m.mission_type === ronin_interfaces_1.MissionType.pvp; }).shift();
                                                            dailyStats.lasttotalwincount = pvp === null || pvp === void 0 ? void 0 : pvp.progress;
                                                        }
                                                        else {
                                                            console.log("Unable to fetch mission stats for " + scholar.name + ". Skipping to the next scholar...");
                                                            scholarsToReprocess.push(scholar);
                                                            return [2 /*return*/];
                                                        }
                                                        _a.label = 8;
                                                    case 8: return [4 /*yield*/, scholars_service_1.addDailyStats(dailyStats)];
                                                    case 9:
                                                        result = _a.sent();
                                                        if (result.success) {
                                                            console.log("Successfully fetched daily status for " + scholar.name + " - " + scholar.roninaddress);
                                                        }
                                                        else {
                                                            console.log("Unable to save daily status for " + scholar.name + " - " + scholar.roninaddress);
                                                            return [2 /*return*/];
                                                        }
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })).then(function () {
                                            if (scholarsToReprocess.length > 0) {
                                                var tempScholarsToReprocess_1 = scholarsToReprocess;
                                                setTimeout(function () {
                                                    scholarsToReprocess = [];
                                                    console.log("There are scholars that needs to be reprocessed. " + scholars_1.filter(function (s) { return s.name; }));
                                                    _this.emit(poller_interface_1.EventTypes.DailyReset, tempScholarsToReprocess_1);
                                                }, 15000);
                                            }
                                            console.log("There are no scholars to reprocess. Will now start generating report.");
                                            _this.emit(poller_interface_1.EventTypes.ReadyForReport);
                                        }).catch(function (error) {
                                            console.log(error);
                                            throw ("Something is wrong when fetching daily stats");
                                        })];
                                case 6:
                                    _c.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_1 = _c.sent();
                                    console.log('Unable to complete daily status report. Will try again later.', error_1);
                                    this.sendMessageToAchievements("I'm failing master. Please check the logs.");
                                    setTimeout(function () {
                                        sent = false;
                                        _this.emit(poller_interface_1.EventTypes.TICK);
                                    }, 15000);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                });
                this.on(poller_interface_1.EventTypes.ReadyForReport, function () { return __awaiter(_this, void 0, void 0, function () {
                    var dailyStatusReports, error_2;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, scholars_service_1.getDailyStats()];
                            case 1:
                                dailyStatusReports = _a.sent();
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
                                                                value: "" + (dailyStatusReport.totalslp || 0),
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ":white_check_mark: Total Wins",
                                                                value: "" + (dailyStatusReport.lasttotalwincount || 0),
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':rocket: MMR',
                                                                value: "" + (dailyStatusReport.elo || 0),
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':crown: Rank',
                                                                value: "" + (dailyStatusReport.currentrank || 0),
                                                                inline: true,
                                                            },
                                                            {
                                                                name: ':date: Timestamp',
                                                                value: "" + moment_1.default(Date.now()).format('MMMM Do YYYY, h:mm:ss a'),
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
                                        _this.sendMessageToAchievements("I'm failing master. Please check the logs. " + error);
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
