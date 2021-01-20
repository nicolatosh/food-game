import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GameMatch } from './app.types';



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

  initGame(gamemode:string, matchType:string): Observable<GameMatch>{
    let gamesettings = {
      'gamemode': gamemode,
      'matchtype': matchType
    }
    return this.http.post<GameMatch>(environment.apiPlay, gamesettings, this.httpOptions)
  }
}
