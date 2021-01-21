import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Answer, GameMatch, Match } from '../app.types';
import { GameService } from '../game.service';
import { LoginService } from '../login.service';
import { TimerService } from '../timer.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameid: string = "";
  gamemode: string = "";
  usernick: string = "";
  matchtype: string = "";
  timeleft: number = 0;
  timerleftPercentage: number = 0;
  game: GameMatch;
  lastMatch!: Match;
  gameOver: boolean;
  answerToSend: Answer = {
      "gameid": "",
      "userid": "",
      "answer": []
  }
  answerArray: Array<String> = [];
  returnUrl: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timer: TimerService,
    private gameService: GameService
  ) {
    this.game = {
      'gameid' : "",
      'gamemode': "",
      'game_status': "",
      'matches': []
    }
    this.gameOver = false
  }


  ngOnInit(): void {
    //in this way we are able to understand wich call has taken us here
    this.route.params
      .subscribe(params => {
        console.log(params)
        this.gameid = params['gameid']
        this.gamemode = params['gamemode']
        this.usernick = params['usernick']
        this.matchtype = params['matchtype']
      });

      this.timer.startTimer().subscribe( timer => this.timeleft = timer )
      this.initMatch()
      this.answerToSend = {
        "gameid": this.gameid,
        "userid": this.usernick,
        "answer": []
      }
  }

  initMatch(){
    let res = this.gameService.getGame(this.gameid)
    if(res){
      this.game = res
      this.lastMatch = this.game['matches'][this.game["matches"].length-1]
    }else{
      console.log("Game match faild to init. Game match:", res)
    }
  }

  buildAnswer(response:String){
    this.answerArray.push(response)
    this.answerToSend.answer = this.answerArray
    console
    if(this.checkSendAnswer()){
      //send answer to backend
      this.gameService.sendAnswer(this.answerToSend)
        .subscribe((game) => {
          if(game.gameid){
            this.game = game;
            this.lastMatch = this.game['matches'][this.game["matches"].length-1];
            this.answerToSend.answer = [];
            this.answerArray = [];
            this.initMatch()
            this.timer.stopTimer()
            this.timer.startTimer().subscribe( timer => this.timeleft = timer )
          }else{
            switch (String(game)) {
              case "Wrong answer":
                  this.gameOver = true
                  console.log("Wrong Answer");
                  this.returnUrl = `/game/lose`
                  this.router.navigateByUrl(this.returnUrl);
                break;

              case "Game finished!":
                  this.gameOver = true
                  console.log("Game win");
                  this.returnUrl = `/game/win`
                  this.router.navigateByUrl(this.returnUrl);
                break;
            
              default:
                break;
            }
          }
        });
    }
  }

  checkSendAnswer(): boolean{
    if(this.lastMatch.scrambled_ingredients.length > 0){
      return this.answerArray.length === this.lastMatch.scrambled_ingredients.length
    }else{ 
      return this.answerArray.length === this.lastMatch.scrambled_steps.length
    }
  }

}
