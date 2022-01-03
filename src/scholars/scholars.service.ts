/**
 * Data Model Interfaces
 * Libraries
 */

import { DailyStatusReport, Scholar } from "./scholars.interface";
import { listScholars, dailySLPByRoninAddress, dailyStatusReport } from "./scholars.repository";

/**
 * Call Repository
 */


/**
 * Service Methods
 */

export const getScholars = async (): Promise<Scholar[]> => {
  const scholars = await listScholars()
  return scholars;
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
}

//  Converts "0x" to "ronin:"
export const toRoninAddress = async (clientId: string) => {
  return clientId.replace(/^.{2}/g, 'ronin:');
};