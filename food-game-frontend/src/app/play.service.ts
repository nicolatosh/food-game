import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GameMatch, User } from './app.types';



@Injectable({
  providedIn: 'root'
})
export class PlayService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getMatchesType(): Observable<Array<string>>{
    return this.http.get<Array<string>>(environment.apiMatchTypes)
  }

  initGame(gamemode:string, matchType:string): Observable<GameMatch> {
    let gamesettings = {
      'gamemode': gamemode,
      'matchtype': matchType
    }
    return this.http.post<GameMatch>(environment.apiPlay, gamesettings, this.httpOptions)
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);

        //Handle the error here

        return throwError(err);    //Rethrow it back to component
      }),
      map((game:GameMatch) => {
        if(game.gameid){
          return game;
        }
        return game;
      }
    ))
  }

  joinGame(gameid:string): Observable<GameMatch> {
    let user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    let gamesettings = {
      'gameid': gameid,
      'userid': user.nickname
    }

    return this.http.post<GameMatch>(environment.apiJoin, gamesettings, this.httpOptions)
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);

        //Handle the error here

        return throwError(err);    //Rethrow it back to component
      }),
      map((game:GameMatch) => {
        if(game.gameid){
          return game;
        }
        return game;
      }
    ))
  }
}
