/**
 * Data Model Interfaces
 * Libraries
 */

import { Scholar } from "./scholars.interface";
const scholars: Scholar[] = [
  {
    id: 1,
    roninAddress: "ronin:55cce35326ba3ae2f27c3976dfbb8aa10d354407",
    name: "Jampot",
    createdOn: ""
  },
  // {
  //   id: 2,
  //   roninAddress: "ronin:1e9d7412e75d4d89df9102f1bf796d86b0ade73f",
  //   name: "Ichiman",
  //   createdOn: ""
  // }
]

/**
 * Call Repository
 */


/**
 * Service Methods
 */

export const listScholars = async (): Promise<Scholar[]> => {
  return scholars;
}
