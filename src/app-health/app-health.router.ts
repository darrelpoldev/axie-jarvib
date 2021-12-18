/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import { AppHealth } from "./app-health.interfaces";
import * as AppHealthService from "./app-health.service";

/**
 * Router Definition
 */
export const appHealthRouter = express.Router();

/**
 * Controller Definitions
 */

// GET app-health
appHealthRouter.get(["/", "/0"], async (req: Request, res: Response) => {
  try {
    const appHealth: AppHealth = await AppHealthService.v1();
    res.status(200).send(appHealth);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET <resource>:id

// POST <resource>

// PUT <resource>/:id

// DELETE <resource>/:id