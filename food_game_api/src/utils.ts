import e from "express";
import { games } from "./game";
import { GameMatch } from "./types";



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