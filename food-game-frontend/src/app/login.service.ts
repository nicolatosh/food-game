import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from './app.types';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) { }

  login(nickname: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(environment.apiLogin, { "nickname": nickname, "password": password}, this.httpOptions);
  }

  register(nickname: string, password: string): Observable<IUser> {
    console.log(nickname, password)
    return this.http.post<IUser>(environment.apiRegister, {"nickname": nickname, "password": password}, this.httpOptions);
  }
}
