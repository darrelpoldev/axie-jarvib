/**
 * Data Model Interfaces
 * Libraries
 */

//  jarvib_db
//  scholars
//      -   id
//      -   roninAddress
//      -   name
//      -   createdOn
export interface Scholar {
  id: number,
  roninaddress: string,
  name: string,
  discordid: string,
  encryptedprivatekey?: string,
  createdOn: string,
  accountowner: string;
  accountownerdiscordid: string;
}

export interface Accumulated_SLP {
  id?: number,
  roninAddress: string,
  scholarId: number,
  total: number,
  createdOn?: string
}

export interface DailyStatusReport {
  farmedslpfromyesterday: number,
  scholarid: number,
  name: string,
  discordid: string,
  roninaddress: string,
}

export interface DailyStats {
  scholarid: number,
  name: string,
  discordid: string,
  roninaddress: string,
  totalslp: number,
  elo: number,
  currentrank: number,
  lasttotalwincount?: number,
  createdon?: string,
  unclaimedslp?: number
}