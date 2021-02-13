import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
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

   logout(): Observable<boolean>{
    let user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
      return this.http.post(environment.apiLogin, { "nickname": user.nickname, "password": user.password, 'logout': true}, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        map((res:any) => {
          if(res['operation']){
            sessionStorage.removeItem('user')
            return true
          }
          return false
        }
      ));
  }

  public get currentUserValue(): User {
    console.log("CURRENT USER ", this.currentUserSubject.value)
    return this.currentUserSubject.value
  }
  
  register(nickname: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiRegister, {"nickname": nickname, "password": password}, this.httpOptions)
    .pipe(
      catchError(this.handleError),
      map((user:User) => {
        if(user.nickname){
          return user;
        }
        return new User("","");
      }
    ))
  }

  /**
   * Default sample error handler
   * @param error 
   */
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
