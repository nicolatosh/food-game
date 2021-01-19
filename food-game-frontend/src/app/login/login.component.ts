import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, User } from '../app.types';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nickname: string = "";
  password: string = "";
  loginResponse: User = { nickname: "", password:"" }
  registerResponse: User = { nickname: "", password:"" }
  badCredentials: boolean = false;
  returnUrl: string = '';
  constructor(
    private service: LoginService,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
      this.route.queryParams
      .subscribe(params => this.returnUrl = params['return'] || '/play');
      if(this.isLogged().nickname){
        console.log("User already logged in!")
        this.router.navigateByUrl('/play');
      }
  }

  register() {
    if(this.checkCredentials()){
      this.badCredentials = false;
      this.service.register(this.nickname, this.password)
      .subscribe((res:User) => {
        this.registerResponse = res;
        return this.registerResponse;
      });
    }else{
      this.badCredentials = true;
    }
  }
  
  login() {
    if(this.checkCredentials()){
      this.badCredentials = false;
      if(!this.isLogged()){
        this.service.login(this.nickname, this.password)
        .subscribe((res:User) => {
          this.loginResponse = res;
          let user = this.isLogged();
          if(user.nickname){
            console.log(`User ${user.nickname} logged, redirecting...`)
            this.router.navigateByUrl(this.returnUrl);
          }
        });
      }else{
        console.log("User already logged in!")
        this.router.navigateByUrl('/play');
      }
    }else{
      this.badCredentials = true;
    }
  }

  checkCredentials():boolean {
    if(this.nickname.length === 0 || this.password.length === 0){
      return false;
    }
    return true;
  }
  
  isLogged():User {
    let user: User = JSON.parse(localStorage.getItem('user') || '{}')
    return user
  }

}
