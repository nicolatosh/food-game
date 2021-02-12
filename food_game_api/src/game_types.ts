
export enum GAME_MODE {
    Single = "single",
    Multiplayer = "multiplayer"
  }

export enum MATCH_TYPES {
    Rearrange_steps = "rearrange_steps",
    Select_ingredients = "select_ingredients"
}

export enum GAME_STATUS {
  Single_started = "single_started",
  Single_end = "single_end",
  Single_failure = "single_failure",
  Gaming = "gaming",
  Waiting_opponent_connection = "waiting_opponent_connection",
  Game_end = "game_end",
  Opponent_match_win = "opponet_match_win",
  Opponent_wrong_response = "opponent_wrong_response",
  Both_user_failure = "both_user_failure"
}

// Number of milliseconds. 5000 = 5 seconds
export const MATCH_DURATION: Number = 5000;

// Number of matches in a single game
export const MAX_MATCHES: Number = 3;

