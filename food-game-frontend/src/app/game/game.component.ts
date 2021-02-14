import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer, GameMatch, Match, Modalities } from '../app.types';
import { GameService } from '../game.service';
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
  wrongAnswer: boolean = false;
  game: GameMatch;
  lastMatch!: Match;
  answerSent: boolean;
  answerToSend: Answer = {
    "gameid": "",
    "userid": "",
    "answer": []
  }
  answerArray: Array<String> = [];
  returnUrl: string = "";
  disabledButtons: Array<number> = []
  observable: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private timer: TimerService,
    private gameService: GameService,
    private sse: ServersseService,
    private ngZone: NgZone
  ) {
    this.game = {
      'gameid': "",
      'gamemode': "",
      'game_status': "",
      'matches': []
    }
    this.timerSubscription = new Subscription
    this.answerSent = false
    this.observable = new Subscription
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe()
    this.observable.unsubscribe()

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

    // here there is the management of SSE events sent by server
    this.observable = this.sse.returnAsObservable(environment.apiSse).subscribe((data: any) => {
      switch (data.event) {
        case 'nextmatch':
          console.log("Setting next match", data.data)
          this.gameService.setGame(data.data)
          this.ngZone.run(() => this.processGame(data.data))
          break

        case 'gameend':
          console.log("Game end event received")
          this.timer.stopTimer()
          this.timerSubscription.unsubscribe()
          if (this.usernick === data.data.userid) {
            console.log("Congratulation " + this.usernick + " you win!")
            this.ngZone.run(() => this.gameEnd(false))
          } else {
            console.log("Ops! " + this.usernick + " you lost!")
            this.ngZone.run(() => this.gameEnd(true))
          }
          break

        case 'wronganswer':
          if (this.usernick === data.data.userid) {
            console.log("Wrong answer " + this.usernick)
            this.wrongAnswer = true
          }
          break

        case 'matchwin':
          console.log("Setting next match", data.data)
          this.gameService.setGame(data.data)
          this.ngZone.run(() => this.processGame(data.data))
          break

        case 'gamefailure':
          console.log("Game failure event received")
          this.ngZone.run(() => this.gameEnd(true))
          break

        case 'matchexpired':
          console.log("Match time is up. Ending game")
          this.ngZone.run(() => this.gameEnd(true))
          break

        default:
          break;
      }
    })
  }

  /**
   * Initialize a match. Match init depends on which game mode is selected
   */
  initMatch() {
    switch (this.gamemode) {
      case Modalities.SINGLE:
        let res = this.gameService.getGame(this.gameid)
        if (res) {
          this.game = res
          this.lastMatch = this.game['matches'][this.game["matches"].length - 1]
        } else {
          console.log("Game match faild to init. Game match:", res)
        }
        break;

      case Modalities.MULTI:
        let resMulti = this.gameService.getGame(this.gameid)
        if (resMulti) {
          this.game = resMulti
          this.lastMatch = this.game['matches'][this.game["matches"].length - 1]
        } else {
          console.log("Game match faild to init. Game match:", resMulti)
        }
        break;
      default:
        break;
    }
  }

  /**
   * Builds answer by appending user selected items
   * @param response 
   * @param index 
   */
  buildAnswer(response: String, index: number) {
    this.answerArray.push(response)
    this.answerToSend.answer = this.answerArray
    let element = document.getElementById(String(index)) as HTMLElement;
    element.setAttribute('disabled', 'true');
    this.disabledButtons.push(index)
  }

  /**
   * Sends the answer if user press the send button
   */
  sendAnswer() {
    if (this.answerToSend.answer.length > 0) {
      this.answerToSend.userid = this.usernick
      let element = document.getElementById("sendButton") as HTMLElement;
      element.setAttribute('disabled', 'true');
      console.log("Sending this answer: ", this.answerToSend)
      this.answerSent = true
      this.gameService.sendAnswer(this.answerToSend)
        .subscribe((game) => {
          this.ngZone.run(() => {
            if (this.game.gamemode === Modalities.SINGLE) { this.processGame(game) }
          })
        });

    } else {
      console.log("Empty answer. Cannot send it")
    }
  }

  startTimer(): Subscription {
    return this.timer.startTimer().subscribe(timer => {
      if (timer) {
        this.timeleft = timer
      } else {
        //time is up, user lost the game
        console.log("Time is up!");
        this.gameEnd(true)
      }
    })
  }

  /**
   * This method allows to redirect user to win or lost pages.
   * If user has lost then a true value should be supplied.
   * @param lost boolean. If user won the game should be false.
   */
  gameEnd(lost: boolean) {
    this.timerSubscription.unsubscribe()
    this.timer.stopTimer()
    if (lost) {
      this.returnUrl = `/game/lose`
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.returnUrl = `/game/win`
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  getRandId(): string {
    return String(Math.floor((Math.random() * 100) + 1))
  }

  /**
   * Reset Ui buttons attributes
   */
  resetButtons() {
    let btn = document.getElementById("sendButton") as HTMLElement;
    btn.removeAttribute('disabled');
    this.disabledButtons.forEach(e => {
      let element = document.getElementById(String(e)) as HTMLElement;
      if (element) { element.removeAttribute('disabled'); }
    })
  }

  /**
   * This function is responsible to perform some actions on a given
   * GameMatch. It updates the current GameMatch that is being shown
   * by the whole application. Typically a new GameMatch can be revived
   * after user send an anwer for a match.
   * This fucntion updates the "view" according to the game. Manages also
   * errors in case of Single player mode.
   * If game is not an instace of GameMatch, some strings describing
   * errors should be passed.
   * @param game 
   */
  processGame(game: GameMatch) {
    if (game.gameid) {
      this.timer.stopTimer()
      this.timerSubscription.unsubscribe()
      this.game = game;
      this.wrongAnswer = false;
      this.lastMatch = this.game['matches'][this.game["matches"].length - 1];
      this.answerToSend.answer = [];
      this.answerArray = [];
      this.initMatch()
      this.startTimer()
      this.resetButtons()
    } else if (this.gamemode === Modalities.SINGLE) {
      switch (String(game)) {
        case "Wrong answer":
          console.log("Wrong answer");
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
  }
}
