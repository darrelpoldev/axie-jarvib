"use strict";
/**
 * Data Model Interfaces
 * Libraries
 */
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
exports.getDailyStatsByScholarId = exports.GetScholarByDiscordId = exports.addDailyStats = exports.toRoninAddress = exports.getDailyStats = exports.getDailyStatusReport = exports.getDailySLPByRoninAddress = exports.getScholar = exports.getScholars = void 0;
var scholars_repository_1 = require("./scholars.repository");
/**
 * Call Repository
 */
/**
 * Service Methods
 */
var getScholars = function () { return __awaiter(void 0, void 0, void 0, function () {
    var scholars;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scholars_repository_1.listScholars()];
            case 1:
                scholars = _a.sent();
                return [2 /*return*/, scholars];
        }
    });
}); };
exports.getScholars = getScholars;
var getScholar = function (discordid) { return __awaiter(void 0, void 0, void 0, function () {
    var scholars, scholar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scholars_repository_1.listScholars()];
            case 1:
                scholars = _a.sent();
                scholar = scholars.find(function (scholar) { return scholar.discordid === discordid; });
                return [2 /*return*/, scholar];
        }
    });
}); };
exports.getScholar = getScholar;
var getDailySLPByRoninAddress = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scholars_repository_1.dailySLPByRoninAddress(roninAddress)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.getDailySLPByRoninAddress = getDailySLPByRoninAddress;
var getDailyStatusReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, rowData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, scholars_repository_1.dailyStatusReport()];
            case 1:
                result = _a.sent();
                rowData = result.rows;
                return [2 /*return*/, rowData];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDailyStatusReport = getDailyStatusReport;
var getDailyStats = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, rowData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, scholars_repository_1.fetchDailyStats()];
            case 1:
                result = _a.sent();
                rowData = result.rows;
                return [2 /*return*/, rowData];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDailyStats = getDailyStats;
//  Converts "0x" to "ronin:"
var toRoninAddress = function (clientId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, clientId.replace(/^.{2}/g, "ronin:")];
    });
}); };
exports.toRoninAddress = toRoninAddress;
var addDailyStats = function (dailyStats) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, query, params, queryResult, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                query = "INSERT INTO daily_stats (scholarid, roninaddress, totalslp, elo, currentrank, lasttotalwincount, created_on) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp)";
                params = [
                    dailyStats.scholarid,
                    dailyStats.roninaddress,
                    dailyStats.totalslp,
                    dailyStats.elo,
                    dailyStats.currentrank,
                    dailyStats.lasttotalwincount,
                ];
                return [4 /*yield*/, scholars_repository_1.executeQuery(query, params)];
            case 2:
                queryResult = _a.sent();
                if (queryResult.success) {
                    methodResponse.data = queryResult;
                    methodResponse.success = true;
                }
                return [3 /*break*/, 5];
            case 3:
                error_3 = _a.sent();
                console.log("addDailyStats", error_3);
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, methodResponse];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addDailyStats = addDailyStats;
var GetScholarByDiscordId = function (discordId) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, query, params, queryResult, rowData, error_4, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                methodResponse = {
                    data: "",
                    success: false
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                query = "SELECT * FROM scholars where discordid = $1";
                params = [
                    discordId,
                ];
                return [4 /*yield*/, scholars_repository_1.executeQuery(query, params)];
            case 2:
                queryResult = _a.sent();
                if (queryResult.success) {
                    rowData = queryResult.data.rows;
                    methodResponse.data = rowData.length > 0 ? rowData.shift() : null;
                    methodResponse.success = true;
                }
                return [3 /*break*/, 5];
            case 3:
                error_4 = _a.sent();
                console.log("getScholarByDiscordId", error_4);
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, methodResponse];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.GetScholarByDiscordId = GetScholarByDiscordId;
var getDailyStatsByScholarId = function (scholarId) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, query, queryResult, rowData, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                query = "select * from daily_stats where scholarid = " + scholarId + " and created_on >= current_date::timestamp and created_on < current_date::timestamp + interval '1 day' LIMIT 1;";
                return [4 /*yield*/, scholars_repository_1.executeQuery(query)];
            case 2:
                queryResult = _a.sent();
                if (queryResult.success) {
                    rowData = queryResult.data.rows;
                    if (rowData.length) {
                        methodResponse.data = rowData.shift();
                        methodResponse.success = true;
                    }
                    else {
                        methodResponse.data = null;
                        methodResponse.success = false;
                    }
                }
                return [3 /*break*/, 5];
            case 3:
                error_6 = _a.sent();
                console.log("addDailyStats", error_6);
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, methodResponse];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getDailyStatsByScholarId = getDailyStatsByScholarId;
