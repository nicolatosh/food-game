/**
 * This is a core module. Contains the implementation of the game logic functionalities.
 */

import { Error, GameMatch, GameMatchImpl, MatchStats, MatchStatsTemporany } from "./types";
import { GAME_MODE, GAME_STATUS, MATCH_TYPES, MAX_MATCHES } from "./game_types";
import { getMatchFromService, getRandom } from "./utils";
import e from "express";
import { checkAuth } from "./user";

const axios = require('axios').default;
const stream = require('central-event');

// Server resources, should be accessed only via HTTP rest methods
export var games: GameMatch[] = Array();
var gamesTimers: Map<String, NodeJS.Timeout> = new Map<String, NodeJS.Timeout>();
var opponentConnectionTimers: Map<String, NodeJS.Timeout> = new Map<String, NodeJS.Timeout>();
var localGamesStats: Map<String, Array<MatchStats>> = new Map<String, Array<MatchStats>>();
var temporanyMatchStats: Map<String, MatchStatsTemporany> = new Map<String, MatchStatsTemporany>();


/**
 * Creates an instance of "game" which is a container for
 * all game resources with related info so that the game instace can be 
 * interpreted and understood from users
 * 
 * @param gamemode one of available 
 * @param matchtype one of available 
 */
export const buildGame: (gamemode: string, matchtype: string) => Promise<GameMatch | Error> = async (gamemode, matchtype) => {

  let match = await getMatchFromService(matchtype);
  if (match.id) {
    let gameId = getRandom();
    switch (gamemode) {
      case GAME_MODE.Single:
        games.push(new GameMatchImpl(gameId, gamemode, GAME_STATUS.Single_started, match));
        startMatchTimer(gameId);
        break;
      case GAME_MODE.Multiplayer:
        //we set the game in waiting other player mode
        //the opponent has a limited time to join the game
        games.push(new GameMatchImpl(gameId, gamemode, GAME_STATUS.Waiting_opponent_connection, match));
        startOpponentConnectionTimer(gameId);
        break;
    }
  } else {
    throw { "error": "Error in getting matches" }
  }
  return games[games.length - 1];
};

/**
 * Function to allow another user to play a multyplayer game.
 * Checks if the game can accept an opponent and also if the opponent
 * is allowed to play.
 * @param gameid 
 * @param userid 
 */
export const opponentJoinGame: (gameid: string, userid: string) => Promise<GameMatch | Error> = async (gameid, userid) => {
  const game = games.filter(e => e.gameid === gameid);
  var actual_game = game[0];

  console.log("Opponent Join request received")

  // Checking if the game is in the satus so that can accept an opponet
  if (actual_game && actual_game.game_status === GAME_STATUS.Waiting_opponent_connection) {
    games[games.indexOf(actual_game)].game_status = GAME_STATUS.Gaming;
    stopOpponentConnectionTimer(gameid)
    startMatchTimer(gameid)
    localGamesStats.set(gameid, new Array());
    return actual_game
  } else {
    return { "error": "game is not joinable" }
  }
};

/**
 * Endpoint to get all match types supported by the game
 */
export const getMatchTypes: () => Promise<any> = async () => {
  let matches: Array<string> = []
  for (let m in MATCH_TYPES) {
    matches.push(m.toLowerCase())
  }
  return matches
}

/**
 * This function is the core of game logic. Manages the response once the user
 * sent an answer for a match in a game. It modifies the game status according
 * to user answer so game can finish, fail etc.
 * Produces new matches and saves temporany stats.
 * Returns an updated GameMatch {@see GameMatch} or can raise errors.
 * 
 * @param gameid 
 * @param answer 
 * @param userid
 */
export const processInput: (gameid: string, answer: string[], userid: string) => Promise<GameMatch | any> = async (gameid, answer, userid) => {

  const game = games.filter(e => e.gameid === gameid);
  var actual_game = game[0];
  const timer = gamesTimers.get(gameid);

  //at first check if game exist and timer for match is not expired
  if (actual_game && timer) {

    //separate cases for single player mode and multiplayer
    switch (actual_game.gamemode) {

      case GAME_MODE.Single:

        //checking user answer 
        if (checkAnswer(actual_game, answer)) {

          //at this point user has sent correct answer need to check
          //game current status and perform the right action
          //also need to stop match timer
          stopMatchTimer(gameid);
          console.log("User won the match: ", actual_game.matches[actual_game.matches.length - 1]);
          //saving some stats
          localGamesStats.get(actual_game.gameid)?.push({ "matchid": actual_game.matches[actual_game.matches.length - 1].id, "winnerid": userid })
          switch (actual_game.game_status) {
            case GAME_STATUS.Single_started:

              //if it is not the last match, just create a new one of the same type
              if (actual_game.matches.length < MAX_MATCHES) {
                try {

                  //getting new match
                  let new_match = await getMatchFromService(actual_game.matches[0].match_type)
                  if (new_match) {
                    games[games.indexOf(actual_game)].matches.push(new_match);
                  } else { return "Error getting match"; }
                  console.log("Started new match:", new_match);

                  //restarting timer for this new match
                  startMatchTimer(gameid);
                  return games[games.indexOf(actual_game)];
                } catch (error) {
                  return e.toString();
                }
              } else {
                //at this point user finished all matches in the game
                games[games.indexOf(actual_game)].game_status = GAME_STATUS.Single_end;
                console.log("Game finished!");
                stopMatchTimer(actual_game.gameid)
                gameEnd(gameid);
                return "Game finished!";
              }

            case GAME_STATUS.Game_end:
              return "Game finished! No more response allowed";
          }
        } else {
          games[games.indexOf(actual_game)].game_status = GAME_STATUS.Single_failure;
          console.log("Game failed!");
          stopMatchTimer(actual_game.gameid)
          gameEnd(gameid);
          return "Wrong answer"
        }
        break;

      case GAME_MODE.Multiplayer:

        if (checkAnswer(actual_game, answer)) {
          stopMatchTimer(gameid);
          //at this point user has sent correct answer need to check
          //game current status and perform the right action
          console.log("User won the match: ", actual_game.matches[actual_game.matches.length - 1]);
          //saving some stats
          localGamesStats.get(actual_game.gameid)?.push({ "matchid": actual_game.matches[actual_game.matches.length - 1].id, "winnerid": userid })

          switch (actual_game.game_status) {
            case GAME_STATUS.Gaming:
              /**set match won, save stats, SYNC game => send post to both users */
              if (actual_game.matches.length < MAX_MATCHES) {
                try {

                  //getting new match
                  let new_match = await getMatchFromService(actual_game.matches[0].match_type)
                  if (new_match) {
                    games[games.indexOf(actual_game)].matches.push(new_match);
                  } else { return "Error getting match"; }
                  console.log("Started new match:", new_match);

                  //restarting timer for this new match
                  startMatchTimer(gameid);
                  return games[games.indexOf(actual_game)];
                } catch (error) {
                  return e.toString();
                }
              } else {
                //at this point user finished all matches in the game
                games[games.indexOf(actual_game)].game_status = GAME_STATUS.Game_end;
                console.log("Game finished!");
                stopMatchTimer(actual_game.gameid)
                gameEnd(gameid);
                return actual_game;
              }
              break;

            case GAME_STATUS.Opponent_wrong_response:
              //assuring that user who sent a bad response do not send the right one now
              if (temporanyMatchStats.get(gameid)?.bad_response_userid === userid) {
                return "You cannot send another response";
              } else {
                stopMatchTimer(actual_game.gameid)
                let new_match = await getMatchFromService(actual_game.matches[0].match_type)
                if (new_match) {
                  games[games.indexOf(actual_game)].matches.push(new_match);
                  games[games.indexOf(actual_game)].game_status = GAME_STATUS.Gaming;
                } else { return "Error getting match"; }
                console.log("Started new match:", new_match);
                //restarting timer for this new match
                startMatchTimer(gameid);
                return games[games.indexOf(actual_game)];
              }
              break;
          }

          //manage WRONG answers
        } else {
          switch (actual_game.game_status) {

            //user send bad response
            case GAME_STATUS.Gaming:
              //bad response. Game is now set to allow only answers from the other opponent
              temporanyMatchStats.set(gameid, { "matchid": actual_game.matches[actual_game.matches.length - 1].id, "bad_response_userid": userid });
              games[games.indexOf(actual_game)].game_status = GAME_STATUS.Opponent_wrong_response;
              console.log("Wrong answer from user:", userid);
              return actual_game;

            //this case means that both users have sent a bad answer
            //game can go to next match.
            case GAME_STATUS.Opponent_wrong_response:

              //user who already sent a bad answer cannot send nothing more
              if (temporanyMatchStats.get(gameid)?.bad_response_userid === userid) {
                return "You cannot send another response";
              } else {
                stopMatchTimer(actual_game.gameid)
                games[games.indexOf(actual_game)].game_status = GAME_STATUS.Both_user_failure;
                gameEnd(actual_game.gameid)
                return actual_game;
              }
          }
        }
        break;
    }
  } else {
    return { "error": "Game not found" }
  }
};


/**
 * Ending the game: removing from game list.
 * @param gameid 
 */
function gameEnd(gameid: string): void {
  const game = games.filter(e => e.gameid === gameid);
  games.splice(games.indexOf(game[0], 1));
}


/**
 * Manages match expired event. If happens the
 * game is aborted. 
 * Matchexpired event is sent via SSE-event
 * @param gameid 
 */
function matchExpired(gameid: string): void {
  gamesTimers.delete(gameid);
  gameEnd(gameid);
  stream.emit('matchexpired')
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

  gamesTimers.set(gameid, timerid);
}

function stopMatchTimer(gameid: string): void {
  const timerid = gamesTimers.get(gameid);
  if (timerid != null) { clearTimeout(timerid); gamesTimers.delete(gameid); }
  console.log(`Timer for gameId: ${gameid} removed`);
}

function checkAnswer(game: GameMatch, answer: string[]): boolean {
  console.log("Correct answer: ", game.matches[0].answer, "User answer: ", answer);
  return game.matches[game.matches.length - 1].answer.toString().localeCompare(answer.toString()) === 0
}

function startOpponentConnectionTimer(gameid: string): void {

  const timerid: ReturnType<typeof setTimeout> = setTimeout(() => {
    opponentConnectionTimeout(gameid)
  }, 15000);

  opponentConnectionTimers.set(gameid, timerid);
}

/**
 * When it fires a join failure event is sent
 * @param gameid 
 */
function opponentConnectionTimeout(gameid: string): void {
  const opponentTimer = opponentConnectionTimers.get(gameid);
  if (opponentTimer != null) {
    clearTimeout(opponentTimer)
    opponentConnectionTimers.delete(gameid)
    stream.emit('joinfailure')
    gameEnd(gameid)
  }
  console.log(`Multiplayer game: ${gameid} failed to start. Opponent missing`);
}

function stopOpponentConnectionTimer(gameid: string): void {
  const timerid = opponentConnectionTimers.get(gameid);
  if (timerid != null) { clearTimeout(timerid); opponentConnectionTimers.delete(gameid); }
  console.log("Timer for opponent join stopped");
}

/**
 * Performs a check on a game to state who is the winner.
 * The policy is: user that wins more matches than the other one.
 * @param gameid 
 */
export const choseWinner: (gameid: string) => Promise<any> = async (gameid) => {
  let matchesStats = localGamesStats.get(gameid)
  if (matchesStats != undefined) {
    let user = matchesStats[0].winnerid
    let cnt = 0
    matchesStats.forEach(element => {
      element.winnerid === user ? cnt += 1 : ""
    });
    console.log("Match stats:", matchesStats)

    // If this rule applies then the other user is the winner
    if (cnt < (matchesStats.length / 2)) {
      let user2 = matchesStats.filter(e => e.winnerid != user)
      return user2[0].winnerid
    }
    return user
  }
}



