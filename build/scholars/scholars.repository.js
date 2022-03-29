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
exports.fetchDailyStats = exports.executeQuery = exports.addAccumulatedSLP = exports.dailyStatusReport = exports.dailySLPByRoninAddress = exports.listScholars = exports.getPostgresClient = void 0;
/**
 * Data Model Interfaces
 * Libraries
 */
var Client = require('pg').Client;
/**
 * Call Repository
 */
var getPostgresClient = function () {
    return new Client({
        host: "" + process.env.postgresHost,
        port: "" + process.env.postgresPort,
        user: "" + process.env.postgresUser,
        password: "" + process.env.postgresPassword,
        database: "" + process.env.postgresDatabase,
        ssl: process.env.postgresSSL === "true" ? { rejectUnauthorized: false } : false
    });
};
exports.getPostgresClient = getPostgresClient;
var listScholars = function () { return __awaiter(void 0, void 0, void 0, function () {
    var scholars, psqlClient, result, rows, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scholars = [];
                psqlClient = exports.getPostgresClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, psqlClient.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, psqlClient.query("\n      SELECT * FROM scholars;\n      ")];
            case 3:
                result = _a.sent();
                rows = result.rows;
                scholars = rows;
                return [3 /*break*/, 7];
            case 4:
                err_1 = _a.sent();
                console.log("listScholars " + err_1);
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, psqlClient.end()];
            case 6:
                _a.sent();
                return [2 /*return*/, scholars];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.listScholars = listScholars;
var dailySLPByRoninAddress = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var psqlClient, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                psqlClient = exports.getPostgresClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, psqlClient.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, psqlClient.query("\n      SELECT total - lag(total, 1, 0) OVER (ORDER BY created_on) AS result\n      FROM   accumulated_slp\n      WHERE roninAddress = '" + roninAddress + "'\n      ORDER  BY \"created_on\" DESC LIMIT 1;\n      ")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result];
            case 4:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, false];
            case 5: return [4 /*yield*/, psqlClient.end()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.dailySLPByRoninAddress = dailySLPByRoninAddress;
var dailyStatusReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var psqlClient, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                psqlClient = exports.getPostgresClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, psqlClient.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, psqlClient.query("\n      SELECT \n      (SELECT asl.total - lag(asl.total, 1, 0) OVER (order by asl.created_on) as result\n      FROM accumulated_slp as asl \n      WHERE asl.roninAddress = scholars.roninAddress\n      ORDER BY asl.\"created_on\" DESC LIMIT 1) AS farmedslpfromyesterday, \n      scholars.id as scholarid,\n      scholars.name,\n      scholars.discordid,\n      scholars.roninaddress\n      FROM scholars as scholars\n      ORDER BY farmedslpfromyesterday DESC\n      ")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, false];
            case 5: return [4 /*yield*/, psqlClient.end()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.dailyStatusReport = dailyStatusReport;
var addAccumulatedSLP = function (accumulated_SLP) { return __awaiter(void 0, void 0, void 0, function () {
    var psqlClient, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                psqlClient = exports.getPostgresClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, psqlClient.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, psqlClient.query("INSERT INTO accumulated_SLP (scholarId, roninAddress, total, created_on)\n        VALUES ($1, $2, $3, current_timestamp)", [
                        accumulated_SLP.scholarId,
                        accumulated_SLP.roninAddress,
                        accumulated_SLP.total
                    ])];
            case 3:
                _a.sent();
                return [3 /*break*/, 7];
            case 4:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, false];
            case 5: return [4 /*yield*/, psqlClient.end()];
            case 6:
                _a.sent();
                return [2 /*return*/, true];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.addAccumulatedSLP = addAccumulatedSLP;
var executeQuery = function (query, params) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, psqlClient, queryResult, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false
                };
                psqlClient = exports.getPostgresClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, psqlClient.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, psqlClient.query(query, params)];
            case 3:
                queryResult = _a.sent();
                methodResponse.data = queryResult;
                methodResponse.success = true;
                return [3 /*break*/, 7];
            case 4:
                err_5 = _a.sent();
                console.log("executeQuery " + err_5);
                methodResponse.success = false;
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, psqlClient.end()];
            case 6:
                _a.sent();
                return [2 /*return*/, methodResponse];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.executeQuery = executeQuery;
var fetchDailyStats = function () { return __awaiter(void 0, void 0, void 0, function () {
    var psqlClient, result, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                psqlClient = exports.getPostgresClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, psqlClient.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, psqlClient.query("\n      SELECT \n      (SELECT dailyStats.totalslp - lag(dailyStats.totalslp, 1, 0) OVER (order by dailyStats.created_on) as result\n      FROM daily_stats as dailyStats \n      WHERE dailyStats.roninAddress = scholars.roninAddress \n      ORDER BY dailyStats.\"created_on\" DESC LIMIT 1) AS totalslp, \n      (select dailyStats.totalslp FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats.\"created_on\", dailyStats.totalslp ORDER BY dailyStats.\"created_on\" DESC limit 1) as unclaimedslp,\n      (select dailyStats.elo FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats.\"created_on\", dailyStats.elo ORDER BY dailyStats.\"created_on\" limit 1) as elo,\n      (select dailyStats.currentrank FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats.\"created_on\", dailyStats.currentrank ORDER BY dailyStats.\"created_on\" limit 1) as currentrank,\n      (select dailyStats.lasttotalwincount FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats.\"created_on\", dailyStats.lasttotalwincount ORDER BY dailyStats.\"created_on\" limit 1) as lasttotalwincount,\n      scholars.id as scholarid,\n      scholars.name,\n      scholars.discordid, \n      scholars.roninaddress\n      FROM scholars as scholars\n      ORDER BY totalslp DESC\n      ")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result];
            case 4:
                err_6 = _a.sent();
                console.log(err_6);
                return [2 /*return*/, false];
            case 5: return [4 /*yield*/, psqlClient.end()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.fetchDailyStats = fetchDailyStats;
/**
 * Service Methods
 */
