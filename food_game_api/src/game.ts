
import { Error, GameMatch, GameMatchImpl } from "./types";
import config from "../config"
import { json } from "body-parser";
import { GAME_MODE, GAME_STATUS } from "./game_types";

const axios = require('axios').default;

//Contains
export var games: GameMatch[] = Array(); 
var gamesTimers: Map<String, NodeJS.Timeout> = new Map<String, NodeJS.Timeout>();



export const getWelcome: (name: string) => { text: string } = (name) => {
  return {
    text: `Hello ${name} CIAO`,
  };
};

/**
 * Creates an instance of "game" which is a container for
 * all game related info so that the game instace can be 
 * interpreted and understood from users
 * 
 * @param gamemode one of available {@see GAME_MODE}
 * @param matchtype one of available {@see MATCH_TYPES}
 */
export const buildGame: (gamemode: string, matchtype: string) => Promise<GameMatch | Error> = async (gamemode, matchtype) => {
  try {
    let match = await axios.get(`${config.MATCH_SERVICE_URL}/match?type=${matchtype}`);
    
    switch(gamemode){
      case GAME_MODE.Single:
        games.push(new GameMatchImpl("1",gamemode,GAME_STATUS.Started,match.data));
        startMatchTimer("1");
        break;
      case GAME_MODE.Multiplayer:
        games.push(new GameMatchImpl("1",gamemode,GAME_STATUS.Waiting_opponent,match.data));
    }
    return games[games.length-1];
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const processInput: (gameid: string, answer: string[]) => Promise<GameMatch | any> = async (gameid,answer) => {
  
  const game = games.filter(e => e.gameid === gameid);
  if(game){
    //cheking answer
    if(game[1].matches[1].answer == answer){
      console.log("WIN");
      return games[games.length-1];
    }else{
      return console.error("Wrong answer");
    }
  }else{
    return console.error("Game finished!");
  }
};


function matchExpired(gameid: string): void {
  gamesTimers.delete(gameid);
};

/**
 * Allows to set a timer for a match in a game. Match can last
 * for a certain amount of timer {@see MATCH_DURATION}.
 * If timer fires then another function is called {@see matchExpired}
 * @param gameid id of the game in which a match is starting
 */
function startMatchTimer(gameid: string): void {

  const timerid = setTimeout(() => {
    matchExpired(gameid)
  }, 5000);

  gamesTimers.set(gameid,timerid);
}



