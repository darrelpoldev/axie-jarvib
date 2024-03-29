/**
 * Data Model Interfaces
 * Libraries
 */

import { MethodResponse } from "../shared/shared.interfaces";
import { DailyStats, DailyStatusReport, Scholar } from "./scholars.interface";
import {
  listScholars,
  dailySLPByRoninAddress,
  dailyStatusReport,
  executeQuery,
  fetchDailyStats,
} from "./scholars.repository";

/**
 * Call Repository
 */

/**
 * Service Methods
 */

export const getScholars = async (): Promise<Scholar[]> => {
  const scholars = await listScholars();
  return scholars;
};

export const getScholar = async (
  discordid: string
): Promise<Scholar | undefined> => {
  const scholars = await listScholars();
  const scholar = scholars.find((scholar) => scholar.discordid === discordid);
  return scholar;
};

export const getDailySLPByRoninAddress = async (roninAddress: string) => {
  const result = await dailySLPByRoninAddress(roninAddress);
  return result;
};

export const getDailyStatusReport = async (): Promise<DailyStatusReport[]> => {
  try {
    const result = await dailyStatusReport();
    const rowData = <DailyStatusReport[]>result.rows;
    return rowData;
  } catch (error) {
    return [];
  }
};

export const getDailyStats = async (): Promise<DailyStats[]> => {
  try {
    const result = await fetchDailyStats();
    const rowData = <DailyStats[]>result.rows;
    return rowData;
  } catch (error) {
    return [];
  }
};

//  Converts "0x" to "ronin:"
export const toRoninAddress = async (clientId: string) => {
  return clientId.replace(/^.{2}/g, "ronin:");
};

export const addDailyStats = async (dailyStats: DailyStats) => {
  const methodResponse: MethodResponse = {
    data: "",
    success: false,
  };
  try {
    const query = `INSERT INTO daily_stats (scholarid, roninaddress, totalslp, elo, currentrank, lasttotalwincount, created_on) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp)`;
    const params = [
      dailyStats.scholarid,
      dailyStats.roninaddress,
      dailyStats.totalslp,
      dailyStats.elo,
      dailyStats.currentrank,
      dailyStats.lasttotalwincount,
    ];
    const queryResult = await executeQuery(query, params);
    if (queryResult.success) {
      methodResponse.data = queryResult;
      methodResponse.success = true;
    }
  } catch (error) {
    console.log(`addDailyStats`, error);
  } finally {
    return methodResponse;
  }
}

export const GetScholarByDiscordId = async (discordId: number) => {
  try {
    const methodResponse: MethodResponse = {
      data: "",
      success: false
    }
    try {
      const query = `SELECT * FROM scholars where discordid = $1`;
      const params = [
        discordId,
      ];
      const queryResult = await executeQuery(query, params);
      if (queryResult.success) {
        const rowData = <Scholar[]>queryResult.data.rows;
        methodResponse.data = rowData.length > 0 ? rowData.shift() : null;
        methodResponse.success = true;
      }
    } catch (error) {
      console.log(`getScholarByDiscordId`, error);
    } finally {
      return methodResponse;
    }
  } catch (error) {

  }
}

export const getDailyStatsByScholarId = async (scholarId: number) => {
  const methodResponse: MethodResponse = {
    data: "",
    success: false,
  };
  try {
    const query = `select * from daily_stats where scholarid = ${scholarId} and created_on >= current_date::timestamp and created_on < current_date::timestamp + interval '1 day' LIMIT 1;`;
    const queryResult = await executeQuery(query);
    if (queryResult.success) {
      const rowData = <DailyStats[]>queryResult.data.rows;
      if (rowData.length) {
        methodResponse.data = rowData.shift();
        methodResponse.success = true;
      }
      else {
        methodResponse.data = null
        methodResponse.success = false;
      }
    }
  } catch (error) {
    console.log(`addDailyStats`, error);
  } finally {
    return methodResponse;
  }
}