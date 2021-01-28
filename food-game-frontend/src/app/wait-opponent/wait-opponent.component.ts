import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServersseService } from '../serversse.service';

@Component({
  selector: 'app-wait-opponent',
  templateUrl: './wait-opponent.component.html',
  styleUrls: ['./wait-opponent.component.css']
})
export class WaitOpponentComponent implements OnInit, OnDestroy {

  newUrl: any;
  observable: Subscription;

  constructor(private router: Router, private sse: ServersseService, private zone: NgZone) {
    let navigation = this.router.getCurrentNavigation()
    if(navigation){
      this.newUrl = navigation.extras.state as {
        gamemode: string,
        matchtype: string,
        gameid: string,
        user: string
      }
    }
    this.observable = this.sse.returnAsObservable(environment.apiSse).subscribe((data:any) => {
      switch (data.event) {
        case 'join':
          console.log("Opponent joined!")
          let returnUrl = `/game/${this.newUrl.gamemode}/${this.newUrl.matchtype}/${this.newUrl.gameid}/${this.newUrl.user}`
          this.zone.run(() => {
            this.router.navigateByUrl(returnUrl)
          })
          break;
      
        default:
          console.log("DATA",data)
          break;
      }
    })
  }
  ngOnDestroy(): void {
    this.observable.unsubscribe()
  }

  ngOnInit(): void {}

}
