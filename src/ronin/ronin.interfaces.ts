export interface MMR {
  rank: number,
  ELO: number
}

export interface AxieStats {
  total_slp: number,
  raw_total: number,
  next_claim: number,
  last_claim: number,
  rank: number,
  mmr: number
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

export interface Item {
    "item_id": number,
    "amount": number,
    "flag": number
}

export interface Elo {
    "player_id": string,
    "new_elo": number,
    "old_elo": number,
    "_items": Item[],
    "result_type": "win"
}

export interface PvpLog {
    "battle_uuid": string,
    "game_started": string,
    "game_ended": string,
    "winner": string,
    "first_client_id": string,
    "first_team_id": string,
    "first_team_fighters": number[],
    "second_client_id": string,
    "second_team_id": string,
    "second_team_fighters": number[],
    "eloAndItem": Elo[],
    "pvp_type": string
}

export interface BattleLog {
    link: string,
    date: string
}

export enum QuestType {
  daily = "daily"
}

export enum MissionType {
  check_in = "check_in",
  pve = "pve",
  pvp = "pvp",
}
