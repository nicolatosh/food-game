import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer, GameMatch, Match, Modalities } from '../app.types';
import { GameService } from '../game.service';
import { LoginService } from '../login.service';
import { ServersseService } from '../serversse.service';
import { TimerService } from '../timer.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  gameid: string = "";
  gamemode: string = "";
  usernick: string = "";
  matchtype: string = "";
  timeleft: number = 0;
  timerSubscription: Subscription;
  timerleftPercentage: number = 0;
  game: GameMatch;
  lastMatch!: Match;
  answerToSend: Answer = {
      "gameid": "",
      "userid": "",
      "answer": []
  }
  answerArray: Array<String> = [];
  returnUrl: string = "";
  disabledButtons: Array<number> = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timer: TimerService,
    private gameService: GameService,
    private sse: ServersseService
  ) {
    this.game = {
      'gameid' : "",
      'gamemode': "",
      'game_status': "",
      'matches': []
    }
    this.timerSubscription = new Subscription
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe()
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

      this.timerSubscription = this.startTimer()
      this.initMatch()
      this.answerToSend = {
        "gameid": this.gameid,
        "userid": this.usernick,
        "answer": []
      }
  }

  initMatch(){
    switch (this.gamemode) {
      case Modalities.SINGLE:
        let res = this.gameService.getGame(this.gameid)
        if(res){
          this.game = res
          this.lastMatch = this.game['matches'][this.game["matches"].length-1]
        }else{
          console.log("Game match faild to init. Game match:", res)
        }
        break;
    
      case Modalities.MULTI:
        let resMulti = this.gameService.getGame(this.gameid)
        if(resMulti){
          this.game = resMulti
          this.lastMatch = this.game['matches'][this.game["matches"].length-1]
        }else{
          console.log("Game match faild to init. Game match:", resMulti)
        }

        this.sse.returnAsObservable(environment.apiSse).subscribe((data:any) => {
          switch (data) {
            case 'join':
              
              break;
          
            default:
              break;
          }
        })
        break;
      default:
        break;
    }  
  }

  buildAnswer(response:String, index:number){
    this.answerArray.push(response)
    this.answerToSend.answer = this.answerArray
    let element = document.getElementById(String(index)) as HTMLElement;
    element.setAttribute('disabled', 'true');
    this.disabledButtons.push(index)
  }

  sendAnswer(){
    if(this.answerToSend.answer.length > 0){
      console.log("Sending this answer: ", this.answerToSend)
      this.gameService.sendAnswer(this.answerToSend)
        .subscribe((game) => {
          if(game.gameid){
            this.timer.stopTimer()
            this.game = game;
            this.lastMatch = this.game['matches'][this.game["matches"].length-1];
            this.answerToSend.answer = [];
            this.answerArray = [];
            this.initMatch()
            this.startTimer()
            this.resetButtons()
          }else{
            switch (String(game)) {
              case "Wrong answer":
                  console.log("Wrong Answer");
                  this.gameEnd(true)
                break;

              case "Game finished!":
                  console.log("Game win");
                  this.gameEnd(false)
                break;
            
              default:
                break;
            }
          }
        });
      
    }else{
      console.log("Empty answer. Cannot send it")
    }
  }

  startTimer(): Subscription{
     return this.timer.startTimer().subscribe( timer =>{
      if(timer){
        this.timeleft = timer
      }else{
        //time is up, user lost the game
        console.log("Time is up!");
        this.gameEnd(true)
      }
    })
  }
  
  gameEnd(lost:boolean){
    this.timer.stopTimer()
    this.timerSubscription.unsubscribe()
    if(lost){
      this.returnUrl = `/game/lose`
      this.router.navigateByUrl(this.returnUrl);
    }else{
      this.returnUrl = `/game/win`
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  getRandId(): string{
    return String(Math.floor((Math.random() * 100) + 1))
  }

  resetButtons(){
    this.disabledButtons.forEach(e => {
      let element = document.getElementById(String(e)) as HTMLElement;
      console.log("RESETTING", element)
      element.removeAttribute('disabled');
    })
  }
}
