import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Answer, GameError, GameMatch } from './app.types';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //Map of GameId,GameMatch
  private games = new Map<string,GameMatch>();
  private errorSubject: BehaviorSubject<GameError>;
  private errorToSend: Observable<any>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private http: HttpClient) {
    this.errorSubject = new BehaviorSubject<GameError>({ "error": "no-error"});
    this.errorToSend = this.errorSubject.asObservable();
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

  sendAnswer(answer:Answer): Observable<GameMatch>{
    let ans = {
      "gameid": answer.gameid,
      "userid": answer.userid,
      "answer": answer.answer
    }
    console.log("sending", answer)
    return this.http.post<GameMatch>(environment.apiGame, answer, this.httpOptions)
    .pipe(
      catchError(this.handleError.bind(this)),
      map((game:GameMatch) => {
        if(game.gameid){
          this.removeGame(game.gameid)
          this.setGame(game)
        }
        return game;
    }));
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
        `body was: ${error.error.text}`);  
    }
    // Return an observable with a user-facing error message.
    (this).errorSubject.next(error.error.text)
    return this.errorToSend
  }

}
