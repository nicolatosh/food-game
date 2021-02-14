/**
 * This controller manages user operations.
 * Delegates the real "heavy" work to the user module.
 * Here there is the logic to manage user related api calls.
 */

import { Request, Response } from 'express';
import { signinUser, loginUser, checkAuth } from './user';

/**
 * Perform the signin process.
 * Requires a JSON body with nickname and password.
 * @param req 
 * @param res 
 */
export const signin = async (req: Request, res: Response) => {
 
    const response_body = req.body;
    const nickname = response_body['nickname'];
    const password = response_body['password'];
    
    //Checks on parameters
     if ((nickname != null && nickname!= " ") && (password != null && password!= " ")) {
       res.send(await signinUser(nickname,password));
     } else {
       res.status(400);
       res.send({ error: 'Supplied bad credentials to perform a signin' });
     }
};

/**
 * Perform the login process.
 * Requires a JSON body with nickname and password.
 * If user wants to logout also a 'logout' true param is needed.
 * @param req 
 * @param res 
 */
export const login = async (req: Request, res: Response) => {

    const response_body = req.body;
    const nickname = response_body['nickname'];
    const password = response_body['password'];
    const logout = response_body['logout']
   
    //Checks on parameters
    if(logout){
      res.send(await loginUser(nickname, password, true))
    }else{
      if ((nickname != null && nickname!= " ") && (password != null && password!= " ")){
          res.send(await loginUser(nickname, password, false));
      } else {
        res.status(400);
        res.send({ 'error': 'Supplied bad credentials to login' });
      }
    }
  };

/**
 * Middleware to be used to check whether the user is authenticated
 * @param req 
 * @param res 
 * @param next 
 */
export const logger = async (req: Request, res: Response, next:Function) =>{
  const response_body = req.body;
  const nickname = response_body['userid'];
  if((nickname == undefined) || (!checkAuth(nickname))){
    res.status(400);
    res.send({ 'error': 'not authorized' });
  }else{
    next();
  }
}