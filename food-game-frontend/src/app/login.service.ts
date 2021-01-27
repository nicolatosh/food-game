import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser, User } from './app.types';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

 httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(nickname: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiLogin, { "nickname": nickname, "password": password}, this.httpOptions)
    .pipe(
      map((user:User) => {
        if(user != null){
          sessionStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }else{
          return new User("","")
        }
    }));
  }

  public get currentUserValue(): User {
    console.log("CURRENT USER ", this.currentUserSubject.value)
    return this.currentUserSubject.value
  }
  
  register(nickname: string, password: string): Observable<User> {
    return this.http.post<IUser>(environment.apiRegister, {"nickname": nickname, "password": password}, this.httpOptions);
  }
}
