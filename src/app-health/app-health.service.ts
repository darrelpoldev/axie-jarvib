/**
 * Data Model Interfaces
 * Libraries
 */
 import { AppHealth, AppHealthStatus } from './app-health.interfaces';


/**
 * Call Repository
 */


/**
 * Service Methods
 */

export const v1 = async (): Promise<AppHealth> => {
  let appHealthStatus: AppHealth = {
    status: AppHealthStatus.GREEN,
    currentVersion: `v${process.env.appVersion}`
  };
  return appHealthStatus;
}