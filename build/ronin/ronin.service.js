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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = exports.getBattleLogs = exports.getPVELogs = exports.getPVPLogs = exports.getMissionStatsByRoninAddress = exports.submitSignature = exports.getRandomMessage = exports.getAccessToken = exports.fetchData = exports.getData = exports.getMMRbyRoninAddress = exports.getMMRInfoByRoninAddresses = exports.getSLPInfoByRoninAddresses = exports.getTotalSLPByRonin = exports.getAxieAPI = void 0;
var easyqrcodejs_nodejs_1 = __importDefault(require("easyqrcodejs-nodejs"));
var web3_1 = __importDefault(require("web3"));
var shared_service_1 = require("../shared/shared.service");
var web3 = new web3_1.default();
var axiosRetry = require('axios-retry');
/**
 * Data Model Interfaces
 * Libraries
 */
var axios = require('axios');
axiosRetry(axios, {
    retries: 3,
    retryDelay: function (retryCount) {
        console.log("retry attempt: " + retryCount);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: function (error) {
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    }
});
/**
 * Call Repository
 */
/**
 * Service Methods
 */
var getAxieAPI = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var scholarDetails, errorMessage_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (roninAddress == "")
                    return [2 /*return*/, ""];
                return [4 /*yield*/, axios.get(process.env.axieAPIEndpoint + "/" + roninAddress)];
            case 1:
                scholarDetails = _a.sent();
                return [2 /*return*/, scholarDetails.data];
            case 2:
                errorMessage_1 = _a.sent();
                console.log("getAxieAPI " + errorMessage_1);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAxieAPI = getAxieAPI;
var getTotalSLPByRonin = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var scholarDetails, errorMessage_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (roninAddress == "")
                    return [2 /*return*/, ""];
                return [4 /*yield*/, axios.get(process.env.roninSLPEndpoint + "/" + roninAddress)];
            case 1:
                scholarDetails = _a.sent();
                return [2 /*return*/, scholarDetails.data];
            case 2:
                errorMessage_2 = _a.sent();
                console.log("getTotalSLPByRonin " + errorMessage_2);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTotalSLPByRonin = getTotalSLPByRonin;
var getSLPInfoByRoninAddresses = function (roninAddresses, authorization) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, roninResponse, methodResponse_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.getData(process.env.roninSLPEndpoint + "/" + roninAddresses.toString(), authorization)];
            case 2:
                roninResponse = _a.sent();
                methodResponse_1 = {
                    data: roninResponse,
                    success: true
                };
                return [2 /*return*/, methodResponse_1];
            case 3:
                error_1 = _a.sent();
                methodResponse.errorDetails = {
                    message: "Unable to get AccessToken",
                    stack: error_1
                };
                return [2 /*return*/, methodResponse];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSLPInfoByRoninAddresses = getSLPInfoByRoninAddresses;
var getMMRInfoByRoninAddresses = function (roninAddresses, authorization) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, roninResponse, playerMMRInfos, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.getData(process.env.roninMMREndpoint + "/" + roninAddresses.toString(), authorization)];
            case 2:
                roninResponse = _a.sent();
                if (roninResponse) {
                    playerMMRInfos = roninResponse.map(function (itemInfo) {
                        var playerMMR = itemInfo.items[1];
                        return playerMMR;
                    });
                    methodResponse.data = playerMMRInfos;
                    methodResponse.success = true;
                }
                return [2 /*return*/, methodResponse];
            case 3:
                error_2 = _a.sent();
                methodResponse.errorDetails = {
                    message: "Unable to get AccessToken",
                    stack: error_2
                };
                return [2 /*return*/, methodResponse];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMMRInfoByRoninAddresses = getMMRInfoByRoninAddresses;
var getMMRbyRoninAddress = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var result, response, items, data, mmrDetails, MMR, errorMessage_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {
                    ELO: 0,
                    rank: 0
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                if (roninAddress == "")
                    return [2 /*return*/, result];
                return [4 /*yield*/, axios.get(process.env.roninMMREndpoint + "/" + roninAddress)];
            case 2:
                response = _a.sent();
                items = response.data[0]["items"];
                data = items !== undefined ? items : [];
                if (data.length == 0)
                    return [2 /*return*/, result];
                mmrDetails = data[1];
                MMR = {
                    ELO: mmrDetails["elo"],
                    rank: mmrDetails["rank"]
                };
                result = MMR;
                return [3 /*break*/, 5];
            case 3:
                errorMessage_3 = _a.sent();
                console.log("getTotalSLPByRonin " + errorMessage_3);
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, result];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getMMRbyRoninAddress = getMMRbyRoninAddress;
var getData = function (endpoint, authorization) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, axios.get(endpoint, shared_service_1.axieRequiredHeaders(authorization))];
            case 1:
                _a = _b.sent(), data = _a.data, status = _a.status;
                if (status < 200 && status >= 300) {
                    throw Error('Axie Infinity API have a problem');
                }
                return [2 /*return*/, data];
        }
    });
}); };
exports.getData = getData;
var fetchData = function (postData) { return __awaiter(void 0, void 0, void 0, function () {
    var url, _a, data, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "" + process.env.axieGQLEndpoint;
                return [4 /*yield*/, axios.post(url, postData, shared_service_1.axieRequiredHeaders())];
            case 1:
                _a = _b.sent(), data = _a.data, status = _a.status;
                if (status < 200 && status >= 300) {
                    throw Error('Axie Infinity API have a problem');
                }
                return [2 /*return*/, data];
        }
    });
}); };
exports.fetchData = fetchData;
var getAccessToken = function (clientId, roninPrivateKey) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, roninClientId, roninAccountPrivateKey, randomMessageResponse, accessToken, methodResponse_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                roninClientId = clientId;
                roninAccountPrivateKey = roninPrivateKey;
                return [4 /*yield*/, exports.getRandomMessage()];
            case 2:
                randomMessageResponse = _a.sent();
                return [4 /*yield*/, exports.submitSignature(roninClientId, roninAccountPrivateKey, randomMessageResponse.data)];
            case 3:
                accessToken = _a.sent();
                methodResponse_2 = {
                    data: accessToken,
                    success: true
                };
                return [2 /*return*/, methodResponse_2];
            case 4:
                error_3 = _a.sent();
                methodResponse.errorDetails = {
                    message: "Unable to get AccessToken",
                    stack: error_3
                };
                return [2 /*return*/, methodResponse];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAccessToken = getAccessToken;
var getRandomMessage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, exports.fetchData({
                        'operationName': "CreateRandomMessage",
                        'query': "mutation CreateRandomMessage {\n  createRandomMessage\n}\n",
                        'variables': {}
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, {
                        status: true,
                        data: response.data.createRandomMessage
                    }];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, {
                        data: '',
                        status: false
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRandomMessage = getRandomMessage;
var submitSignature = function (accountAddress, privateKey, randMessage) { return __awaiter(void 0, void 0, void 0, function () {
    var hexSignature, signature, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                hexSignature = web3.eth.accounts.sign(randMessage, privateKey);
                signature = hexSignature['signature'];
                return [4 /*yield*/, exports.fetchData({
                        "operationName": "CreateAccessTokenWithSignature",
                        "variables": { "input": { "mainnet": shared_service_1.mainnet, "owner": accountAddress, "message": randMessage, "signature": signature } },
                        "query": "mutation CreateAccessTokenWithSignature($input: SignatureInput!) {\n  createAccessTokenWithSignature(input: $input) {\n    newAccount\n    result\n    accessToken\n    __typename\n  }\n}\n"
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.createAccessTokenWithSignature.accessToken];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.submitSignature = submitSignature;
var getMissionStatsByRoninAddress = function (roninAddress, accessToken) { return __awaiter(void 0, void 0, void 0, function () {
    var methodResponse, response, quests, errorMessage_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                methodResponse = {
                    data: "",
                    success: false
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                if (roninAddress == "")
                    return [2 /*return*/, methodResponse];
                return [4 /*yield*/, exports.getData(process.env.roninMissionStatsEndpoint + "/" + roninAddress, accessToken)];
            case 2:
                response = _a.sent();
                quests = response["items"];
                methodResponse.data = quests;
                methodResponse.success = true;
                return [3 /*break*/, 5];
            case 3:
                errorMessage_4 = _a.sent();
                console.log("getMissionStatsByRoninAddress " + errorMessage_4);
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, methodResponse];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getMissionStatsByRoninAddress = getMissionStatsByRoninAddress;
var getPVPLogs = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var res, errorMessage_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (roninAddress == "")
                    return [2 /*return*/, []];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get(process.env.pvpEndpoint + "/" + roninAddress)];
            case 2:
                res = _a.sent();
                return [2 /*return*/, res.data.battles];
            case 3:
                errorMessage_5 = _a.sent();
                console.log("getPVPLogs " + errorMessage_5);
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPVPLogs = getPVPLogs;
var getPVELogs = function (roninAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var res, errorMessage_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (roninAddress == "")
                    return [2 /*return*/, []];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get(process.env.pveEndpoint + "/" + roninAddress)];
            case 2:
                res = _a.sent();
                return [2 /*return*/, res.data.battles];
            case 3:
                errorMessage_6 = _a.sent();
                console.log("getPVPLogs " + errorMessage_6);
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPVELogs = getPVELogs;
var getBattleLog = function (battle) {
    var date = new Date(battle.game_started).toLocaleString("en-US", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    return {
        link: "" + process.env.axieReplayEndpoint + battle.battle_uuid,
        date: date
    };
};
var getBattleLogs = function (pvpLogs, returnArr) {
    if (returnArr === void 0) { returnArr = false; }
    var latest = pvpLogs.slice(0, 3);
    var battleLogs = latest.map(getBattleLog);
    if (returnArr)
        return battleLogs;
    var btlLogsString = battleLogs.reduce(function (p, n) { return p + ("[" + n.date + "](" + n.link + ")\n"); }, "");
    return btlLogsString;
};
exports.getBattleLogs = getBattleLogs;
// convert Access token to QR Code
var generateQRCode = function (accessToken, fileId, scholarName) {
    var qrcode = new easyqrcodejs_nodejs_1.default({
        text: accessToken,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: easyqrcodejs_nodejs_1.default.CorrectLevel.L,
        quietZone: 15,
        quietZoneColor: "rgba(0,0,0,0)",
        logo: './jadewicklogo.jpg',
        logoWidth: 40,
        logoHeight: 40,
        title: "Generated by JARVIB",
        titleColor: "#004284",
        titleBackgroundColor: "#fff",
        titleHeight: 20,
        titleTop: 10,
    });
    var fname = fileId + "-qrcode.png";
    qrcode.saveImage({
        path: fname
    });
    return fname;
};
exports.generateQRCode = generateQRCode;
