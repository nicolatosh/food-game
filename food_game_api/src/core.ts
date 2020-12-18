/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
 */

import { Error, GameMatch, GameMatchImpl } from "./types";
import config from "../config"
import { json } from "body-parser";
import { GAME_MODE, GAME_STATUS } from "./game_types";

const axios = require('axios').default;
var games: GameMatch[] = Array();

//#region --- EXAMPLE ---

export const getWelcome: (name: string) => { text: string } = (name) => {
  return {
    text: `Hello ${name} CIAO`,
  };
};


export const buildGame: (gamemode: string, matchtype: string) => Promise<GameMatch | Error> = async (gamemode, matchtype) => {
  try {
    let match = await axios.get(`${config.MATCH_SERVICE_URL}/match?type=${matchtype}`);
    
    switch(gamemode){
      case GAME_MODE.Single:
        games.push(new GameMatchImpl(1,gamemode,GAME_STATUS.Started,match.data));
        break;
      case GAME_MODE.Multiplayer:
        games.push(new GameMatchImpl(1,gamemode,GAME_STATUS.Waiting_opponent,match.data));
    }
    return games[games.length-1];
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};