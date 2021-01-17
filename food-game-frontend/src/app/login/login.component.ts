import { Component, OnInit } from '@angular/core';
import { IUser } from '../app.types';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nickname: string = "";
  password: string = "";
  loginResponse: IUser = { nickname: "", password:"" }
  registerResponse: IUser = { nickname: "", password:"" }
  badCredentials: boolean = false;
  constructor(private service: LoginService) {}

  ngOnInit(): void {
  }

  register() {
    if(this.checkCredentials()){
      this.badCredentials = false;
      this.service.register(this.nickname, this.password)
      .subscribe((res:IUser) => {
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
      this.service.login(this.nickname, this.password)
      .subscribe((res:IUser) => {
        this.registerResponse = res;
      });
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

}
