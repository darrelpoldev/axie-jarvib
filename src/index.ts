/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { appHealthRouter } from './app-health/app-health.router';
import * as JARVIB from './jarvib-commands/jarvib-commands.service';
import "reflect-metadata";
import { scholarsRouter } from "./scholars/scholars.router";

dotenv.config();
/**
 * App Variables
 */

if (!process.env.PORT) {
  console.error(`SERVICE ERROR: Unable to start service. Required port is missing.`);
  console.error(`Setting port 8080 as default.`);
}

const PORT = process.env.PORT || 8080;
const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
//  /api/<version>/resource
app.use("/api/v1/status", appHealthRouter);
app.use("/api/v1/scholars", scholarsRouter);
//  app.use("/api/v2/status", appHealthV2Router); -- versioning

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`SERVICE INFO: Listening on port ${PORT}...`);
  console.log(`environment: ${process.env.environment}`);
});

JARVIB.startListening();