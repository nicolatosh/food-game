import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameMatch } from './app.types';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //Map of GameId,GameMatch
  private games = new Map<string,GameMatch>();

  constructor() { 
   
  }

  setGame(game:GameMatch):void {
    console.log("setting game", game)
    this.games.set(game.gameid,game)
  }

  getGame(gameId:string): GameMatch | false {
    return this.games.get(gameId) || false
  }

  removeGame(gameId:string):void {
    this.games.delete(gameId)
  }
}
