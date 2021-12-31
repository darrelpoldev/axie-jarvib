/**
 * Data Model Interfaces
 * Libraries
 */
import { url } from 'inspector';
import { AppHealth, AppHealthStatus } from './app-health.interfaces';
const axios = require('axios');

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

export const selfPing = async () => {
  const url = `${process.env.healthCheckEndpoint}`;
  const config = {
    method: 'GET',
    url: url
  };

  let result = await axios(config);
  console.log(result.data);
}