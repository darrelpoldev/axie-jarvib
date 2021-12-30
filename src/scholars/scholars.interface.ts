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
  roninAddress: string,
  name: string,
  discordId: string,
  createdOn: string
}

export interface Accumulated_SLP {
  id: number,
  roninAddress: string,
  scholarId: number,
  total: number,
  createdOn: string
}

