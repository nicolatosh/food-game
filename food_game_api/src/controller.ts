import { Request, Response } from 'express';
import { buildGame, processInput, opponentJoinGame, getMatchTypes, choseWinner } from './game';
import { GAME_MODE, GAME_STATUS, MATCH_TYPES } from './game_types';
import { checkGameActive } from './utils';

const stream = require('central-event')

/**
 * Endpoint to check if the service is online.
 * Just returns "Hello World" message.
 * @param req 
 * @param res 
 */
export const welcome = (req: Request, res: Response) => {
  
  res.status(200)
  res.send("Food-game online!")

};

/**
 * This endpoint "/play" allows to start a game.
 * Exprected a JSON with "gamemode" and "matchtype".
 * e.g "/play?gamemode=..."
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
        stream.emit('nextmatch', newGame)
        res.send(newGame)
        res.status(200)
        break
      
      case GAME_STATUS.Game_end:
        let winner = choseWinner(newGame.gameid)
        stream.emit('gameend', {userid: await winner})
        res.send(newGame)
        res.status(200)
        break
      
      case GAME_STATUS.Opponent_wrong_response:
        stream.emit('wronganswer', {userid: userid})
        res.send("Wrong answer")
        res.status(200)
        break
      
      case GAME_STATUS.Opponent_match_win:
        stream.emit('matchwin', newGame)
        res.send(newGame)
        res.status(200)
        break

      case GAME_STATUS.Both_user_failure:
        stream.emit('gamefailure')
        stream.removeAllListeners('gamefailure')
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
      stream.emit('join', function(){
        stream.emit('join', { 'msg' : 'joined'})
        stream.removeAllListeners('join')
      });
      res.status(200);
      res.send(joined);
    }   
  }else{
    res.status(404);
    res.send({ error: 'Game does not exits!' });
  }
};

export const matchtypes = async (req: Request, res: Response) => {
  res.send(await getMatchTypes());
}
