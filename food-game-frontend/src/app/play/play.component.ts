import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Modalities } from '../app.types';
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

  constructor(
    private service: PlayService,
    private router: Router,
    private route: ActivatedRoute
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
    this.service.initGame(this.gamemode,this.matchtype)
      .subscribe(game => console.log("game receive", game));
  }

}
