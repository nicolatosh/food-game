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
import { buildGame, getWelcome, processInput, opponentJoinGame, getMatchTypes, choseWinner } from './game';
import { GAME_MODE, GAME_STATUS, MATCH_TYPES } from './game_types';
import { GameMatch } from './types';
import { checkGameActive } from './utils';

const Stream = require('central-event');


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
  let game = await buildGame(gamemode,matchtype).catch((e) =>{
    res.status(400);
    res.send({ error: e.error });
  })
 
 //Checks on parameters
  if ((gamemode == GAME_MODE.Single || gamemode == GAME_MODE.Multiplayer) 
      && (matchtype == MATCH_TYPES.Rearrange_steps || matchtype == MATCH_TYPES.Select_ingredients)) {
    Stream.removeAllListeners('matchwin')
    res.send(game);
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

  let newGame = await processInput(gameid,answer,userid)
  
  if(await game != false){
    switch (newGame.game_status) {
      case GAME_STATUS.Gaming:
        Stream.emit('nextmatch', newGame)
        res.send(newGame)
        res.status(200)
        break
      
      case GAME_STATUS.Game_end:
        let winner = choseWinner(newGame.gameid)
        Stream.emit('gameend', {userid: await winner})
        Stream.removeAllListeners('gameend')
        res.send(newGame)
        res.status(200)
        break
      
      case GAME_STATUS.Opponent_wrong_response:
        Stream.emit('wronganswer', {userid: userid})
        Stream.removeAllListeners('wronganswer')
        res.send("Wrong answer")
        res.status(200)
        break
      
      case GAME_STATUS.Opponent_match_win:
        Stream.emit('matchwin', newGame)
        Stream.removeAllListeners('matchwin')
        res.send(newGame)
        res.status(200)
        break

      case GAME_STATUS.Both_user_failure:
        Stream.emit('gamefailure')
        Stream.removeAllListeners('gamefailure')
        res.send("Game failure")
        res.status(200)
        break

      default: 
        res.send(newGame)
        res.status(200)
        break;
    }
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
    let joined = await opponentJoinGame(gameid,userid).catch((e) => {
      res.status(404);
      res.send({ error: e.error });
    })

    if(await joined){
      Stream.emit('join', function(){
        Stream.emit('join', { 'msg' : 'joined'})
      });
      res.status(200);
      res.send(joined);
      Stream.removeAllListeners('join')
    }   
  }else{
    res.status(404);
    res.send({ error: 'Game does not exits!' });
  }
};

export const matchtypes = async (req: Request, res: Response) => {
  res.send(await getMatchTypes());
}

export const sse = async (req: Request, res: Response) => {
  res.writeHead(200,{
    'Content-type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  Stream.on('join', function(){
    console.log("send event join")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'join', 'data': ""}) + '\n\n');
  });

  Stream.on('nextmatch', (data:GameMatch) =>{
    console.log("send event nextmatch")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'nextmatch', 'data': data}) + '\n\n');
  });

  Stream.on('wronganswer', (data:GameMatch) =>{
    console.log("send event wronganswer")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'wronganswer', 'data': data}) + '\n\n');
  });

  Stream.on('matchwin', (data:GameMatch) =>{
    console.log("send event matchwin")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'matchwin', 'data': data}) + '\n\n');
  });

  Stream.on('gameend', (data:GameMatch) =>{
    console.log("send event gameend")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'gameend', 'data': data}) + '\n\n');
  });

  Stream.on('gamefailure', function() {
    console.log("send event gamefailure")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'gamefailure', 'data': {}}) + '\n\n');
  });

  Stream.on('matchexpired', function() {
    console.log("send event gamefailure")
    res.write('event: message' +'\n' + 'data: ' + JSON.stringify({'event': 'matchexpired', 'data': {}}) + '\n\n');
 });
}

