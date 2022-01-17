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
exports.JobScheduler = void 0;
/**
 * Data Model Interfaces
 * Libraries
 */
var schedule = require('node-schedule');
var axios = require('axios');
var discord_js_1 = require("discord.js");
var app_health_service_1 = require("../app-health/app-health.service");
var scholars_service_1 = require("../scholars/scholars.service");
/**
 * Call Repository
 */
/**
 * Service Methods
 */
var JobScheduler = /** @class */ (function () {
    function JobScheduler(_discordClient) {
        this.discordClient = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES
            ]
        });
        this.discordClient = _discordClient;
    }
    JobScheduler.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rule, job;
            var _this = this;
            return __generator(this, function (_a) {
                console.info("job initiated....");
                rule = new schedule.RecurrenceRule();
                rule.hour = "" + process.env.jobHour;
                // rule.minute = 39;
                rule.tz = "" + process.env.TZ;
                job = schedule.scheduleJob(rule, function () { return __awaiter(_this, void 0, void 0, function () {
                    var axieScholarRoleId, scholars, channel, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.info("job started....");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                axieScholarRoleId = process.env.axieScholarRoleId;
                                return [4 /*yield*/, scholars_service_1.getScholars()];
                            case 2:
                                scholars = _a.sent();
                                channel = this.discordClient.channels.cache.get("" + process.env.discordChannelId);
                                if (channel === null || channel === void 0 ? void 0 : channel.isText()) {
                                    channel.send("Hey, this is a test from node-scheduler from the server.");
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    JobScheduler.prototype.startSelfPingJob = function () {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            return __generator(this, function (_a) {
                console.info("starting self ping jobg");
                job = schedule.scheduleJob('*/1 * * * *', function () {
                    app_health_service_1.selfPing();
                });
                return [2 /*return*/];
            });
        });
    };
    return JobScheduler;
}());
exports.JobScheduler = JobScheduler;
