/**
 * Data Model Interfaces
 * Libraries
 */

import { Scholar } from "./scholars.interface";
import { listScholars, dailySLPByRoninAddress } from "./scholars.repository";

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

//  Converts "0x" to "ronin:"
export const toRoninAddress = async (clientId: string) => {
  return clientId.replace(/^.{2}/g, 'ronin:');
};