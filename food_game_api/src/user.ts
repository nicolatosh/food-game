import { json } from "body-parser";
import e from "express";
import config from "../config";
import { checkUserPassword, hashPassword } from "./utils.user";

const axios = require('axios').default;

export class User {
    nickname: string;
    password: string;

    constructor(nick: string, password: string){
        this.nickname = nick;
        this.password = password;
    }
}

/**
 * Allows to register a user given nickname and password
 * @param nickname 
 * @param password 
 */
export const signinUser: (nickname: string, password: string) => Promise<boolean> = async (nickname, password) => {

    //register user if username is available
    if(!isUserDuplicate(nickname)){
       let res = await insertUser(nickname,password)
       return res
    }
    return false;
}

/**
 * Function to check if the nickname is already assigned to a user
 * @param nickname input as string
 */
const isUserDuplicate: (nickname: string) => Promise<boolean> = async (nickname) =>{

    try {
        let user = await axios.get(`${config.USER_SERVICE_URL}/user=${nickname}`);
        return user;
      } catch (error) {
        return error;
      }
}

/**
 * Register user into the User service database
 * @param nickanme 
 * @param password 
 */
const insertUser: (nickname:string, password: string) => Promise<boolean> = async (nickname,password) =>{

    let user = { 'nickname': nickname, 'password': hashPassword(password) };
    try {
        let response = await axios.post(`${config.USER_SERVICE_URL}/user`, user);
        return response.data;
      } catch (error) {
        return error;
      }
}

/**
 * Returns a user taken from User service iff he's present in DB and credentials are correct
 * @param nickname 
 * @param password 
 */
export const loginUser: (nickname:string, password: string) => Promise<User> = async (nickname,password) =>{

    try {
        let user: User = await axios.get(`${config.USER_SERVICE_URL}/user=${nickname}`);
        //comparing clear password with hashed one
        let match: boolean = await checkUserPassword(password,user.password);
        if(match){return user}
      } catch (error) {
        return error;
      }
}