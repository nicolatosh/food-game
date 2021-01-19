import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



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

  initGame(gamemode:string, matchType:string){
    let gamesettings = {
      'gamemode': gamemode,
      'matchtype': matchType
    }
    return this.http.post(environment.apiPlay, gamesettings, this.httpOptions)
  }
}
