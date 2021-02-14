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
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getMatchesType(): Observable<Array<string>> {
    return this.http.get<Array<string>>(environment.apiMatchTypes)
  }

  initGame(gamemode: string, matchType: string): Observable<GameMatch> {
    let user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    let gamesettings = {
      'gamemode': gamemode,
      'matchtype': matchType,
      'userid': user.nickname
    }
    return this.http.post<GameMatch>(environment.apiPlay, gamesettings, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        map((game: GameMatch) => {
          if (game.gameid) {
            return game;
          }
          return game;
        }
        ))
  }

  joinGame(gameid: string): Observable<GameMatch> {
    let user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    let gamesettings = {
      'gameid': gameid,
      'userid': user.nickname
    }

    return this.http.post<GameMatch>(environment.apiJoin, gamesettings, this.httpOptions)
      .pipe(
        catchError(this.handleError.bind(this)),
        map((game: GameMatch) => {
          if (game.gameid) {
            return game;
          }
          return game;
        }))
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
