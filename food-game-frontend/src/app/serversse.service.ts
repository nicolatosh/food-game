import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root'
})
export class ServersseService {

  private subj = new BehaviorSubject([]);
  event!: EventSource;
  
  constructor(private sse: SseService) {
    
  }

  returnAsObservable(source: string)
  {
    this.getSseEvent(source)
    return this.subj.asObservable();
  }

  getSseEvent(source: string){
   this.event = this.sse.getServerEvent(source)
   let subject = this.subj;
      this.event.onmessage=function(e)
      {
        console.log("Sse service received new event", JSON.parse(e.data))
        subject.next(JSON.parse(e.data));
      }
  }
}
