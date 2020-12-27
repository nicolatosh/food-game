
import { Error, GameMatch, GameMatchImpl, Match, MatchStats } from "./types";
import config from "../config"
import { json } from "body-parser";
import { GAME_MODE, GAME_STATUS, MAX_MATCHES } from "./game_types";
import { getMatchFromService, getRandom } from "./utils";
import e from "express";

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
 * @param gamemode one of available 
 * @param matchtype one of available 
 */
export const buildGame: (gamemode: string, matchtype: string) => Promise<GameMatch | Error> = async (gamemode, matchtype) => {
  
    let match = await getMatchFromService(matchtype);
    if(match){
      let gameId = getRandom();
      switch(gamemode){
        case GAME_MODE.Single:
          games.push(new GameMatchImpl(gameId,gamemode,GAME_STATUS.Started,match));
          startMatchTimer(gameId);
          break;
        case GAME_MODE.Multiplayer:
          games.push(new GameMatchImpl(gameId,gamemode,GAME_STATUS.Waiting_opponent,match));
          startMatchTimer(gameId);
          break;
      }
    }
    return games[games.length-1];
};


/*TODO consider "select_ingredients" types of matches
/**
 * This function is the core of game logic. Once user 
 * 
 * @param gameid 
 * @param answer 
 */
export const processInput: (gameid: string, answer: string[]) => Promise<GameMatch | any> = async (gameid,answer) => {
  
  const game = games.filter(e => e.gameid === gameid);
  var actual_game = game[0];
  const timer = gamesTimers.get(gameid);

  //at first check if game exist and timer for match is not expired
  if(actual_game && timer){

      //separate cases for single player mode and multyplayer
      switch(actual_game.gamemode){

        case GAME_MODE.Single:

          //checking user answer 
          if(checkAnswer(actual_game,answer)){

            stopMatchTimer(gameid);
            //at this point user has sent correct answer need to check
            //game current status and perform the right action
            console.log("User won the match: ", actual_game.matches[actual_game.matches.length-1]);
            //saving some stats
            localGamesStats.set(gameid, { "matchid": actual_game.matches[actual_game.matches.length-1].id, "winnerid": "1"});
            switch (actual_game.game_status){
              case GAME_STATUS.Started:

                //if it is not the last match, just create a new one of the same type
                if(actual_game.matches.length < MAX_MATCHES){    
                  try {
                    
                    //getting new match
                    let new_match = await getMatchFromService(actual_game.matches[0].match_type)
                    if(new_match){
                      games[games.indexOf(actual_game)].matches.push(new_match);
                    }else{ return "Error getting match"; }
                    console.log("Started new match:", new_match);

                    //restarting timer for this new match
                    startMatchTimer(gameid);
                    return games[games.indexOf(actual_game)];
                  } catch (error) {
                    return e.toString();
                  }   
                }else{
                  //at this point user finished the game
                  games[games.indexOf(actual_game)].game_status = GAME_STATUS.Game_end;
                  console.log("Game finished!");
                  gameEnd(gameid);
                  return "Game finished!";
                }
              
              case GAME_STATUS.Game_end:
                return "Game finished! No more response allowed";
            }
          }else{
            return "Wrong answer"
          }
          
        case GAME_MODE.Multiplayer:

        break;
      }

    }else{
      return "Game not found"
    }
};


/**
 * Set the game to "end" status.
 * @param gameid 
 */
function gameEnd(gameid: string): void {

  const game = games.filter(e => e.gameid === gameid);
  game[0].gamemode = GAME_STATUS.Game_end;
  //games.splice(games.indexOf(game[0],1));
}


//TODO when exipres delete game
function matchExpired(gameid: string): void {
  gamesTimers.delete(gameid);
  gameEnd(gameid); 
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

function checkAnswer(game: GameMatch, answer: string[]): boolean {
  console.log("Correct answer: ", answer, "User answer: ", game.matches[0].answer);
  return game.matches[game.matches.length-1].answer.toString() === answer.toString()
}





