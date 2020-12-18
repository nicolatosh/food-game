import e from "express";
import { games } from "./game";
import { GameMatch } from "./types";



export const checkGameActive: (gameid: string) => Promise<GameMatch | false> = async (gameid) => {
  let game = games.filter(e => e.gameid === gameid);
  if(game.length == 1){
      return game[1];
  }
  return false;
};
