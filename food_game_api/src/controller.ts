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
import { buildGame, getWelcome } from './core';

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
 * 
 * @param req 
 * @param res 
 */
export const play = async (req: Request, res: Response) => {
 
 const gamemode = req.query['gamemode'];
 const matchtype = req.query['matchtype'];
 
 //Checks on parameters
  if (gamemode === "single" && matchtype === "rearrange_steps") {
    res.send(await buildGame(gamemode,matchtype));
  } else {
    res.status(400);
    res.send({ error: 'Invalid name format!' });
  }
};

