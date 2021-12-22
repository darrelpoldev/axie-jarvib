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
        var _this = this;
        console.info("polling starts");
        var sent = false;
        this.poll("" + process.env.pollingInterval);
        this.on(poller_interface_1.EventTypes.TICK, function () { return __awaiter(_this, void 0, void 0, function () {
            var hourToNotify, utcDate, localDateTime, currentHour, channel;
            return __generator(this, function (_a) {
                try {
                    hourToNotify = process.env.hourToNotify || 8;
                    utcDate = new Date();
                    localDateTime = new Date(utcDate.toString());
                    currentHour = localDateTime.getHours();
                    console.log(hourToNotify);
                    if (currentHour == hourToNotify && !sent) {
                        channel = this.discordClient.channels.cache.get('862115684820844544');
                        if (channel === null || channel === void 0 ? void 0 : channel.isText()) {
                            channel.send("Tangina alas OTSO na. Oras na para malaman pinaka noob sa inyo!");
                        }
                        sent = true;
                    }
                    else if (currentHour != hourToNotify) {
                        sent = false;
                        console.log('resetting sent value to false at...', localDateTime);
                    }
                    else {
                        console.log('checking at...', localDateTime);
                    }
                }
                catch (error) {
                    console.error("Error on " + poller_interface_1.EventTypes.TICK, error);
                }
                this.poll("" + process.env.pollingInterval);
                return [2 /*return*/];
            });
        }); });
    };
    EventPoller.prototype.stop = function () {
        console.info('polling stops');
    };
    EventPoller.prototype.poll = function (interval) {
        var _this = this;
        setTimeout(function () { return _this.emit(poller_interface_1.EventTypes.TICK); }, parseInt("" + interval));
    };
    return EventPoller;
}(events_1.EventEmitter));
exports.EventPoller = EventPoller;