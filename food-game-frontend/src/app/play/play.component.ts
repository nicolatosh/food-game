import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameMatch, Modalities } from '../app.types';
import { GameService } from '../game.service';
import { LoginService } from '../login.service';
import { PlayService } from '../play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  gamemode: string = "";
  matchtype: string = "";
  modeSelected: boolean;
  availableMatches: any = [];
  returnUrl: string = "";

  constructor(
    private service: PlayService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService
  ) { this.modeSelected = false; }

  ngOnInit(): void {
    this.availableMatches = this.service.getMatchesType()
      .subscribe(matches => this.availableMatches = matches);
  }

  single(){
    this.modeSelected = true;
    this.gamemode = Modalities.SINGLE;
  }

  multi(){
    this.modeSelected = true;
    this.gamemode = Modalities.MULTI;
  }

  join(){

  }

  play(match:string){
    this.matchtype = match;
    switch (this.gamemode) {
      case Modalities.SINGLE:
        this.service.initGame(this.gamemode,this.matchtype)
          .subscribe((game:GameMatch) => {
            if(game){
              let gameid = game["gameid"]
              this.gameService.setGame(game)
              this.returnUrl = `/game/${this.gamemode}/${this.matchtype}/${gameid}/${this.loginService.currentUserValue.nickname}`
              this.router.navigateByUrl(this.returnUrl);
            }else{
              //error
            }
          });
        break;
      
      case Modalities.MULTI:

        break;
      default:
        break;
    }
  }

}
