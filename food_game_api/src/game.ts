
import { Error, GameMatch, GameMatchImpl, MatchStats } from "./types";
import config from "../config"
import { json } from "body-parser";
import { GAME_MODE, GAME_STATUS, MAX_MATCHES } from "./game_types";
import { getRandom } from "./utils";

const axios = require('axios').default;

//Contains
export var games: GameMatch[] = Array(); 
var gamesTimers: Map<String, NodeJS.Timeout> = new Map<String, NodeJS.Timeout>();
var localGamesStats: Map<String, MatchStats> = new Map<String, MatchStats>();



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
    let gameId = getRandom();

    switch(gamemode){
      case GAME_MODE.Single:
        games.push(new GameMatchImpl(gameId,gamemode,GAME_STATUS.Started,match.data));
        startMatchTimer(gameId);
        break;
      case GAME_MODE.Multiplayer:
        games.push(new GameMatchImpl(gameId,gamemode,GAME_STATUS.Waiting_opponent,match.data));
    }
    return games[games.length-1];
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

/**
 * This function is the core of game logic. Once user 
 * 
 * @param gameid 
 * @param answer 
 */
export const processInput: (gameid: string, answer: string[]) => Promise<GameMatch | any> = async (gameid,answer) => {
  
  const game = games.filter(e => e.gameid === gameid);
  const timer = gamesTimers.get(gameid);
  
  if(game && timer){
    //cheking answer
    console.log("Answer", answer, game[0].matches[0].answer)
    if(game[0].matches[game[0].matches.length-1].answer.toString() === answer.toString()){

      //user x wins
      stopMatchTimer(gameid);
      console.log("WIN match:", game[0]);
      localGamesStats.set(gameid, { "matchid": game[0].matches[game[0].matches.length-1].id, "winnerid": "1"});

      let match = await axios.get(`${config.MATCH_SERVICE_URL}/match?type=${game[0].matches[0].match_type}`);

      switch(game[0].gamemode){
        case GAME_MODE.Single:
          if(game[0].matches.length < MAX_MATCHES){       
            games[games.indexOf(game[0])].matches.push(match.data);
            console.log("Started new match", games);
            startMatchTimer(gameid);
            return games[games.indexOf(game[0])];
          }else{
            //TODO save stats, remove game
            gameEnd(gameid);
            return "Game Win!";
          }
        break;

        case GAME_MODE.Multiplayer:

        break;
      }

      return games[games.length-1];
    }else{
      return "Wrong answer"
    }
  }else{
    return "Game finished!"
  }
};


function gameEnd(gameid: string): void {

  const game = games.filter(e => e.gameid === gameid);
  games.splice(games.indexOf(game[0],1));
}


//TODO when exipres delete game
function matchExpired(gameid: string): void {
  gamesTimers.delete(gameid);
  gameEnd(gameid); // ? maybe add a flag instead of removing it
  console.log(`Match expired for gameId: ${gameid}`);
};

/**
 * Allows to set a timer for a match in a game. Match can last
 * for a certain amount of timer {@see MATCH_DURATION}.
 * If timer fires then another function is called {@see matchExpired}
 * @param gameid id of the game in which a match is starting
 */
function startMatchTimer(gameid: string): void {

  const timerid: ReturnType<typeof setTimeout> = setTimeout(() => {
    matchExpired(gameid)
  }, 10000);

  gamesTimers.set(gameid,timerid);
}

function stopMatchTimer(gameid: string): void {
  const timerid = gamesTimers.get(gameid);
  if(timerid != null){clearTimeout(timerid); gamesTimers.delete(gameid);}
  console.log(`Timer for gameId: ${gameid} removed`);
}





