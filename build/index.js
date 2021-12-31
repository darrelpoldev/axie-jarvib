"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Required External Modules
 */
var dotenv = __importStar(require("dotenv"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var app_health_router_1 = require("./app-health/app-health.router");
var JARVIB = __importStar(require("./jarvib-commands/jarvib-commands.service"));
require("reflect-metadata");
var scholars_router_1 = require("./scholars/scholars.router");
dotenv.config();
/**
 * App Variables
 */
if (!process.env.PORT) {
    console.error("SERVICE ERROR: Unable to start service. Required port is missing.");
    console.error("Setting port 8080 as default.");
}
var PORT = process.env.PORT || 8080;
var app = express_1.default();
/**
 *  App Configuration
 */
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(express_1.default.json());
// Routes
//  /api/<version>/resource
app.use("/api/v1/status", app_health_router_1.appHealthRouter);
app.use("/api/v1/scholars", scholars_router_1.scholarsRouter);
//  app.use("/api/v2/status", appHealthV2Router); -- versioning
/**
 * Server Activation
 */
app.listen(PORT, function () {
    console.log("SERVICE INFO: Listening on port " + PORT + "...");
    console.log("environment: " + process.env.environment);
});
JARVIB.startListening();
