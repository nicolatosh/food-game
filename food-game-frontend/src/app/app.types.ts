export interface IUser{
    nickname: string,
    password: string
}

export class User implements IUser{
    nickname: string;
    password: string;
    
    constructor(nick: string, pass: string){
        this.nickname = nick;
        this.password = pass;
    }
}

export class Modalities {
    public static SINGLE: string = "single";
    public static MULTI: string = "multiplayer";
}

export interface Match {
    id: string;
    match_type: string;
    recipe_name: string;
    scrambled_ingredients: Array<String>;
    scrambled_steps: Array<String>;
    answer: Array<String>;
  }
  
  export interface GameMatch {
    gameid: string;
    gamemode: string;
    game_status: string;
    matches: Match[];
  }

  export interface Answer {
    gameid: string;
    userid: string;
    answer: Array<String>;
  }

  export interface GameError {
      error: string;
  }