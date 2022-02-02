/**
 * Data Model Interfaces
 * Libraries
 */
const { Client } = require('pg');

import { MethodResponse } from "../shared/shared.interfaces";
import { Accumulated_SLP, DailyStats, Scholar } from "./scholars.interface";


const dummyScholars: Scholar[] = [
  {
    id: 1,
    roninaddress: "ronin:55cce35326ba3ae2f27c3976dfbb8aa10d354407",
    name: "Jampot",
    discordid: "250629138862440448",
    createdOn: ""
  },
  {
    id: 2,
    roninaddress: "ronin:1e9d7412e75d4d89df9102f1bf796d86b0ade73f",
    name: "Ichiman",
    discordid: "543694609159684106",
    createdOn: ""
  }
]

/**
 * Call Repository
 */
export const getPostgresClient = () => {
  return new Client({
    host: `${process.env.postgresHost}`,
    port: `${process.env.postgresPort}`,
    user: `${process.env.postgresUser}`,
    password: `${process.env.postgresPassword}`,
    database: `${process.env.postgresDatabase}`,
    ssl: process.env.postgresSSL === "true" ? true : false
  });
}

export const listScholars = async (): Promise<Scholar[]> => {
  let scholars: Scholar[] = [];
  const psqlClient = getPostgresClient();

  try {
    await psqlClient.connect();
    const result = await psqlClient.query(
      `
      SELECT * FROM scholars;
      `
    );
    const rows: Scholar[] = <Scholar[]>result.rows;
    scholars = rows;
  } catch (err) {
    console.log(`listScholars ${err}`);
  }
  finally {
    await psqlClient.end();
    return scholars;
  }
}

export const dailySLPByRoninAddress = async (roninAddress: string) => {
  const psqlClient = getPostgresClient();
  try {
    await psqlClient.connect();
    const result = await psqlClient.query(
      `
      SELECT total - lag(total, 1, 0) OVER (ORDER BY created_on) AS result
      FROM   accumulated_slp
      WHERE roninAddress = '${roninAddress}'
      ORDER  BY "created_on" DESC LIMIT 1;
      `
    );
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await psqlClient.end();
  }
}

export const dailyStatusReport = async () => {
  const psqlClient = getPostgresClient();
  try {
    await psqlClient.connect();
    const result = await psqlClient.query(
      `
      SELECT 
      (SELECT asl.total - lag(asl.total, 1, 0) OVER (order by asl.created_on) as result
      FROM accumulated_slp as asl 
      WHERE asl.roninAddress = scholars.roninAddress
      ORDER BY asl."created_on" DESC LIMIT 1) AS farmedslpfromyesterday, 
      scholars.id as scholarid,
      scholars.name,
      scholars.discordid,
      scholars.roninaddress
      FROM scholars as scholars
      ORDER BY farmedslpfromyesterday DESC
      `
    );
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await psqlClient.end();
  }
}

export const addAccumulatedSLP = async (accumulated_SLP: Accumulated_SLP) => {
  const psqlClient = getPostgresClient();
  try {
    await psqlClient.connect();
    await psqlClient.query(
      `INSERT INTO accumulated_SLP (scholarId, roninAddress, total, created_on)
        VALUES ($1, $2, $3, current_timestamp)`,
      [
        accumulated_SLP.scholarId,
        accumulated_SLP.roninAddress,
        accumulated_SLP.total
      ]
    );
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await psqlClient.end();
    return true;
  }
}

export const executeQuery = async (query: string, params?: any[]) => {
  const methodResponse: MethodResponse = {
    data: "",
    success: false
  }
  const psqlClient = getPostgresClient();
  try {
    await psqlClient.connect();
    const queryResult = await psqlClient.query(query, params);
    methodResponse.data = queryResult;
    methodResponse.success = true;
  } catch (err) {
    console.log(`executeQuery ${err}`);
    methodResponse.success = false;
  } finally {
    await psqlClient.end();
    return methodResponse;
  }
}

export const fetchDailyStats = async () => {
  const psqlClient = getPostgresClient();
  try {
    await psqlClient.connect();
    const result = await psqlClient.query(
      `
      SELECT 
      (SELECT dailyStats.totalslp - lag(dailyStats.totalslp, 1, 0) OVER (order by dailyStats.created_on) as result
      FROM daily_stats as dailyStats 
      WHERE dailyStats.roninAddress = scholars.roninAddress 
      ORDER BY dailyStats."created_on" DESC LIMIT 1) AS totalslp, 
      (select dailyStats.elo FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats."created_on", dailyStats.elo ORDER BY dailyStats."created_on" limit 1) as elo,
      (select dailyStats.currentrank FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats."created_on", dailyStats.currentrank ORDER BY dailyStats."created_on" limit 1) as currentrank,
      (select dailyStats.lasttotalwincount FROM daily_stats as dailyStats WHERE dailyStats.roninAddress = scholars.roninAddress group by dailyStats."created_on", dailyStats.lasttotalwincount ORDER BY dailyStats."created_on" limit 1) as lasttotalwincount,
      scholars.id as scholarid,
      scholars.name,
      scholars.discordid, 
      scholars.roninaddress
      FROM scholars as scholars
      ORDER BY totalslp DESC
      `
    );
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await psqlClient.end();
  }
}
/**
 * Service Methods
 */

