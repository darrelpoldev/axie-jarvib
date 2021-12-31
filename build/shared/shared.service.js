"use strict";
/**
 * Data Model Interfaces
 * Libraries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHost = exports.isProduction = void 0;
/**
 * Call Repository
 */
/**
 * Service Methods
 */
var isProduction = function () {
    return process.env.environment == "prod";
};
exports.isProduction = isProduction;
var getHost = function () {
    return exports.isProduction() ? process.env.protocol + "://" + process.env.host : process.env.protocol + "://" + process.env.host + ":" + process.env.PORT;
};
exports.getHost = getHost;
