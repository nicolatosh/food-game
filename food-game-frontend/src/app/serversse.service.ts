import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root'
})
export class ServersseService {

  constructor(private sse: SseService, private _zone: NgZone) {}
  
  returnAsObservable(url: string): Observable<any> {
    return Observable.create((observer: any) => {
      const eventSource = this.sse.getServerEvent(url);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          console.log("Sse service received new event", JSON.parse(event.data))
          observer.next(JSON.parse(event.data));
        });
      };
      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
}
