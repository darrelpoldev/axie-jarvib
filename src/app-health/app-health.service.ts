/**
 * Data Model Interfaces
 * Libraries
 */
import { url } from 'inspector';
import { AppHealth, AppHealthStatus } from './app-health.interfaces';
const http = require('http');

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
  console.log(url);
  http.get(url, (response: any) => {

    let data = '';
    response.on('data', (chunk: any) => {
      data += chunk;
    });

    response.on('end', () => {
      console.log(data);
    });

  }).on('error', (error: any) => {
    console.log(`Unable to ping host.`, url, error);
  });
}