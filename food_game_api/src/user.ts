import { AxiosError } from "axios";
import config from "../config";
import { checkUserPassword, hashPassword } from "./utils.user";

const axios = require('axios').default;

/**
 * This class models how the user is.
 * It is a pair of nick and password.
 */
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
 * Retruns boolean response
 * @param nickname 
 * @param password 
 */
export const signinUser: (nickname: string, password: string) => Promise<boolean> = async (nickname, password) => {

  let res = await insertUser(nickname,password)
  return res
}

/**
 * Function to check if the nickname is already assigned to a user.
 * Performs a query to user db service.
 * Returns boolean response.
 * @param nickname input as string
 */
const isUserDuplicate: (nickname: string) => Promise<boolean> = async (nickname) =>{

    try {
        let user = await axios.get(`${config.USER_SERVICE_URL}/user=${nickname}`);
        return user;
      } catch (error) {
        console.log(error);
        return error
      }
}

/**
 * Register user into the User service database. The password is hashed + salted.
 * Returns a boolean response.
 * @param nickanme nickname
 * @param password password
 */
const insertUser: (nickname:string, password: string) => Promise<boolean> = async (nickname,password) =>{

    let user = { 'nickname': nickname, 'password': await hashPassword(password) };
    try {
        let response = await axios.post(`${config.USER_SERVICE_URL}/user`, user);
        return response.data
      } catch (error) {
        return error
      }
}

/**
 * Returns a user taken from User service iff he's present in DB and credentials are correct.
 * Password is hashed and checked with the stored hased version in DB.
 * This method returns a User {@see User} only nickname
 * @param nickname nickname
 * @param password password. Plain string password.
 */
export const loginUser: (nickname:string, password: string) => Promise<String> = async (nickname,password) =>{

    try {
        let user = await axios.get(`${config.USER_SERVICE_URL}/user?nickname=${nickname}`);
        //comparing clear password with hashed one
        let userdata = user.data[0]
        let match: boolean = await checkUserPassword(password,userdata['password']);
        if(match){
          return { "nickname" : userdata['nickname']}
        }
      } catch (error) {
        return error
      }
}