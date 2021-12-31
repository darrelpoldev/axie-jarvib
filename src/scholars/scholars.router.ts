/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import { Scholar } from "./scholars.interface";
import * as ScholarService from "./scholars.service";

/**
 * Router Definition
 */
export const scholarsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET app-health
scholarsRouter.get(["/"], async (req: Request, res: Response) => {
  try {
    const scholars: Scholar[] = await ScholarService.getScholars();
    res.status(200).send(scholars);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET <resource>:id

// POST <resource>

// PUT <resource>/:id

// DELETE <resource>/:id