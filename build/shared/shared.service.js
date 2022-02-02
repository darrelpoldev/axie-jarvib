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
exports.decryptKey = exports.toClientId = exports.axieRequiredHeaders = exports.getHost = exports.isStaging = exports.isProduction = exports.mainnet = void 0;
/**
 * Data Model Interfaces
 * Libraries
 */
var CryptoJS = require("crypto-js");
/**
 * Call Repository
 */
/**
 * Service Methods
 */
exports.mainnet = 'ronin';
var isProduction = function () {
    return process.env.environment == "prod";
};
exports.isProduction = isProduction;
var isStaging = function () {
    return process.env.environment == "staging";
};
exports.isStaging = isStaging;
var getHost = function () {
    return exports.isProduction() || exports.isStaging() ? process.env.protocol + "://" + process.env.host : process.env.protocol + "://" + process.env.host + ":" + process.env.PORT;
};
exports.getHost = getHost;
var axieRequiredHeaders = function (authorization) {
    var headers = {};
    headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36";
    headers["content-type"] = "application/json";
    headers["accept-language"] = "en-US,en;q=0.9";
    headers["origin"] = "https://marketplace.axieinfinity.com";
    headers["authority"] = "graphql-gateway.axieinfinity.com";
    if (authorization) {
        headers["authorization"] = "Bearer " + authorization;
    }
    var result = {
        headers: headers
    };
    return result;
};
exports.axieRequiredHeaders = axieRequiredHeaders;
//  Converts "ronin:" to "0x"
var toClientId = function (clientId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, clientId.replace('ronin:', "0x")];
    });
}); };
exports.toClientId = toClientId;
var decryptKey = function (encryptedKey) { return __awaiter(void 0, void 0, void 0, function () {
    var superSecretKey, bytes, decryptedMessage;
    return __generator(this, function (_a) {
        superSecretKey = "" + process.env.cryptojsKey;
        try {
            if (encryptedKey == "")
                return [2 /*return*/, ""];
            bytes = CryptoJS.AES.decrypt(encryptedKey, superSecretKey);
            decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
            return [2 /*return*/, decryptedMessage];
        }
        catch (error) {
            console.log("\n            Unable to decrypt private key. \n            Encrypted Private key " + encryptedKey + "\n            Used secret " + superSecretKey + ";\n        ");
            return [2 /*return*/, ""];
        }
        return [2 /*return*/];
    });
}); };
exports.decryptKey = decryptKey;
