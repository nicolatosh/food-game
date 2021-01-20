import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameMatch, Match } from '../app.types';
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

  buildAnswer(match:any){

    console.log("MATCH",match, "GAME", this.game)
  }

}
