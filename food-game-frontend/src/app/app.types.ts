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