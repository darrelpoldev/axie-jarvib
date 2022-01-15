export interface MMR {
  rank: number,
  ELO: number
}

export interface Quests {
  quest_type: string,
  missions: [Missions]
}

export interface Missions {
  quest_id: number
  mission_type: string,
  total: number,
  progress: number,
  is_completed: boolean
}

export enum QuestType {
  quest_type = "daily"
}

export enum MissionType {
  check_in = "check_in",
  pve = "pve",
  pvp = "pvp",
}