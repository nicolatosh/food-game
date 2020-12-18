/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */

import { GAME_STATUS } from "./game_types";

export interface Error {
  error: any;
}

export const isError = (arg: any): arg is Error => {
  return arg && arg.error;
};

export interface Match {
  id: string;
  match_type: string;
  recipe_name: string;
  scrambled_ingredients: Array<String>;
  scrambled_steps: Array<String>;
  answer: Array<String>;
}

export interface GameMatch {
  gameid: string;
  gamemode: string;
  game_status: GAME_STATUS;
  matches: Match[];
}

export class GameMatchImpl implements GameMatch {
   gameid: string;
   gamemode: string;
   game_status: GAME_STATUS;
   matches: Array<Match>;

  constructor(gameid: string, gamemode: string, game_status: GAME_STATUS, matches: Match){
    this.gameid = gameid;
    this.gamemode = gamemode;
    this.game_status = game_status;
    this.matches = Array(matches)
  }
  
}
