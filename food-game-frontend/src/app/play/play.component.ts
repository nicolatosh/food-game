import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  gameid: string = "";
  navigationExtras: NavigationExtras;

  constructor(
    private service: PlayService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService
  ) {
    this.modeSelected = false;
    this.navigationExtras = {
      state: {
        gamemode: "",
        matchtype: "",
        gameid: "",
        user: ""
      }
    }
  }

  ngOnInit(): void {
    this.availableMatches = this.service.getMatchesType()
      .subscribe(matches => {
        if (matches) {
          this.availableMatches = matches
        } else {
          console.log("Error in getting matches type")
        }
      });
  }

  single() {
    this.modeSelected = true;
    this.gamemode = Modalities.SINGLE;
  }

  multi() {
    this.modeSelected = true;
    this.gamemode = Modalities.MULTI;
  }

  /**
   * Method triggered from HTLM component page when button JOIN game is clicked.
   * The gameId paramerter is binded to html input form
   */
  join() {
    this.service.joinGame(this.gameid)
      .subscribe((game: GameMatch) => {
        if (game != null) {
          console.log("Game join: ", game)
          let gameid = game["gameid"]
          this.gameService.setGame(game)
          this.returnUrl = `game/${game.gamemode}/${game.matches[0].match_type}/${gameid}/${this.loginService.currentUserValue.nickname}`
          console.log("Nvaigatin to", this.returnUrl)
          this.router.navigateByUrl(this.returnUrl);
        } else {
          console.log("Error in join. Game null")
        }
      });
  }


  /**
   * Method triggered from HTML component. Allows user to logout.
   */
  logout() {
    this.loginService.logout().subscribe((res: boolean) => {
      if (res) {
        this.router.navigateByUrl("/");
      } else {
        console.log("Logout error")
      }
    })
  }

  /**
   * This method is tiggered from the HTML component page in which there are
   * buttons to choose a gamemode (Single or Multi)
   * @param match 
   */
  play(match: string) {
    this.matchtype = match;
    switch (this.gamemode) {
      case Modalities.SINGLE:
        this.service.initGame(this.gamemode, this.matchtype)
          .subscribe((game: GameMatch) => {
            if (game != null) {
              let gameid = game["gameid"]
              this.gameService.setGame(game)
              this.returnUrl = `/game/${this.gamemode}/${this.matchtype}/${gameid}/${this.loginService.currentUserValue.nickname}`
              this.router.navigateByUrl(this.returnUrl);
            } else {
              //error
            }
          });
        break;

      case Modalities.MULTI:
        this.service.initGame(this.gamemode, this.matchtype)
          .subscribe((game: GameMatch) => {
            if (game) {
              let gameid = game["gameid"]
              this.gameService.setGame(game)
              this.navigationExtras = {
                state: {
                  gamemode: this.gamemode,
                  matchtype: this.matchtype,
                  gameid: gameid,
                  user: this.loginService.currentUserValue.nickname
                }
              }
              this.returnUrl = `/game/wait`
              this.router.navigate(['/game/wait'], this.navigationExtras);
            } else {
              console.log("Error from backend: ", game)
            }
          });

        break;
      default:
        break;
    }
  }

}
