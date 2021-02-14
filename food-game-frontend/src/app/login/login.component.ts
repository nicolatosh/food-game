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
  registredok: boolean = false;
  badRegister: boolean = false;
  returnUrl: string = '';
  constructor(
    private service: LoginService,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
      this.route.queryParams
      .subscribe(params => this.returnUrl = params['return'] || '/play');
      let user = this.isLogged()
      if(user != false){
        console.log("User already logged in!")
        this.router.navigateByUrl(this.returnUrl + "/" + user.nickname);
      }
  }

  register() {
    if(this.checkCredentials()){
      this.badCredentials = false;
      this.service.register(this.nickname, this.password)
      .subscribe((res:User) => {
        if(res.nickname != ""){
          this.registerResponse = res;
          this.registredok = true;
          return this.registerResponse;
        }else{
          this.badRegister = true;
        }
        return this.registerResponse
      });
    }else{
      this.badCredentials = true;
    }
  }
  
  login() {
    this.registredok = false
    this.badRegister = false
    if(this.checkCredentials()){
      this.badCredentials = false;
        this.service.login(this.nickname, this.password)
        .subscribe((res:User) => {
          this.loginResponse = res;
          let user = this.isLogged();
          if(user != false){
            console.log(`User ${user.nickname} logged, redirecting...`)
            this.router.navigateByUrl(this.returnUrl + "/" + user.nickname);
          }else{
            console.log("User authentication failure")
            this.badCredentials = true
          }
        });
    }else{
      this.badCredentials = true;
    }
  }

  /**
   * Checks actual nickname and password field that are binded
   * to HTML form
   */
  checkCredentials():boolean {
    if(this.nickname.length === 0 || this.password.length === 0){
      return false;
    }
    return true;
  }
  
  isLogged(): User | false {
    let user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    if(user.nickname != undefined && user.nickname != ''){
      return user
    }
    return false
  }

}
