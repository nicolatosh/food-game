/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
 */

import { Request, Response } from 'express';
import { buildGame, getWelcome, processInput, opponentJoinGame, getMatchTypes } from './game';
import { GAME_MODE, MATCH_TYPES } from './game_types';
import { checkGameActive } from './utils';

export const welcome = (req: Request, res: Response) => {
  // If in the URL (GET request) e.g. localhost:8080/?name=pippo
  const name = req.query['name'];

  // If in body of the request (as json or form-data)
  // const name = req.body['name'];

  // If in the URL as a parameter e.g. localhost:8080/pippo/ and route defined as '/:name'
  // const name = req.params['name'];

  if (name != null && typeof name === 'string') {
    res.send(getWelcome(name));
  } else {
    res.status(400);
    res.send({ error: 'Invalid name format!' });
  }
};

/**
 * This endpoint "/play" allows to start a game.
 * "gamemode" and "matchtype" are requested params. e.g /play?gamemode=...
 * 
 * @param req 
 * @param res 
 */
export const play = async (req: Request, res: Response) => {

  const response_body = req.body;
  const gamemode = response_body['gamemode'];
  const matchtype = response_body['matchtype'];
 
 //Checks on parameters
  if ((gamemode == GAME_MODE.Single || gamemode == GAME_MODE.Multiplayer) 
      && (matchtype == MATCH_TYPES.Rearrange_steps || matchtype == MATCH_TYPES.Select_ingredients)) {
    res.send(await buildGame(gamemode,matchtype));
  } else {
    res.status(400);
    res.send({ error: `Cannot start game with chosen settings: ${gamemode} ${matchtype}` });
  }
};

/**
 * Returns the game given a "gameid" or returns a 404 error message.
 * 
 * @param req 
 * @param res 
 */
export const getMatchstatus = async (req: Request, res: Response) => {

  const gameid = String(req.query['gameid']);

  let game = await checkGameActive(gameid);
  if( game != false){
    res.send(game);
    res.status(200);
  }else{
    res.status(404);
    res.send({ error: 'Game does not exits!' });
  }
};

/**
 * Allows the server to interpret user input e.g answers for matches and 
 * update the game status according to user behavior.
 * @param req 
 * @param res 
 */
export const processUserInput = async (req: Request, res: Response) => {

  const response_body = req.body;
  const gameid = response_body['gameid'];
  const answer = response_body['answer'];
  const userid = response_body['userid'];
  let game = checkGameActive(gameid);

  if(await game != false){
    res.send(await processInput(gameid,answer,userid));
    res.status(200);
  }else{
    res.status(404);
    res.send({ error: 'Game does not exits!' });
  }
};

/**
 * Allows a user to join a game. User must provide a 'gameid' and 'userid'
 * @param req 
 * @param res 
 */
export const opponentJoin = async (req: Request, res: Response) => {

  const response_body = req.body;
  const gameid = response_body['gameid'];
  const userid = response_body['userid'];

  let game = checkGameActive(gameid);

  if(await game != false){
    res.send(await opponentJoinGame(gameid,userid));
    res.status(200);
  }else{
    res.status(404);
    res.send({ error: 'Game does not exits!' });
  }
};

export const matchtypes = async (req: Request, res: Response) => {
  res.send(await getMatchTypes());
}

