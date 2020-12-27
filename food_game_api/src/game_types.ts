
export enum GAME_MODE {
    Single = "single",
    Multiplayer = "multiplayer"
  }

export enum MATCH_TYPES {
    Rearrange_steps = "rearrange_steps",
    Select_ingredients = "select_ingredients"
}

export enum GAME_STATUS {
  Started = "started",
  Waiting_opponent = "waiting_opponent",
  Game_end = "game_end",
  Opponent_match_win = "opponet_match_win",
}

//Nummber of milliseconds. 5000 = 5 seconds
export const MATCH_DURATION: Number = 5000;

export const MAX_MATCHES: Number = 2;

