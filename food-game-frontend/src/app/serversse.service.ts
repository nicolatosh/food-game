import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root'
})
export class ServersseService {

  subj = new BehaviorSubject([]);
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
   if(this.event){
     this.event.onmessage = e => {
      this.subj.next(JSON.parse(e.data))
     }
   }
  }
}
