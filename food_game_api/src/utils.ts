import e from "express";
import config from "../config";
import { games } from "./game";
import { GameMatch, Match } from "./types";

const axios = require('axios').default;



export const checkGameActive: (gameid: string) => Promise<GameMatch | false> = async (gameid) => {
  let game = games.filter(e => e.gameid === gameid);
  if(game.length){
      return game[0];
  }
  return false;
};

export function getRandom(): string {
  return String(Math.floor(Math.random() * 65432));
}


/**
 * Function to fetch a random match of specific type.
 * @param matchtype type of match to get 
 */
export const getMatchFromService: (matchtype: string) => Promise<Match | false> = async (matchtype) => {

  try {
    let match = await axios.get(`${config.MATCH_SERVICE_URL}/match?type=${matchtype}`);
    let matchdata: Match = match.data;
    return matchdata;
  } catch (error) {
    return error;
  }
}