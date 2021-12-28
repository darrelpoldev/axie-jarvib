/**
 * Data Model Interfaces
 * Libraries
 */

import { Scholar } from "./scholars.interface";
import { listScholars } from "./scholars.repository";

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

//  Converts "0x" to "ronin:"
export const toRoninAddress = async (clientId: string) => {
  return clientId.replace(/^.{2}/g, 'ronin:');
};