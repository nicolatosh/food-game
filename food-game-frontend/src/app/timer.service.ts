import { Injectable, Output } from '@angular/core';
import * as EventEmitter from 'events';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  timeLeft: number = 10;
  timer: any;
  private timeLeftSubject: BehaviorSubject<number> = new BehaviorSubject(this.timeLeft);

  constructor() { }

  startTimer() {

    this.timer = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        this.timeLeftSubject.next(this.timeLeft)
      } else {
        this.stopTimer()
      }
    },1000) 

    return this.timeLeftSubject.asObservable()
  }

  stopTimer():void {
    clearInterval(this.timer);
    this.timeLeft = 10;
    this.timeLeftSubject.next(10)
  }
}
