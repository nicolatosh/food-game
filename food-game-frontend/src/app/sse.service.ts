import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor() { }

  event: any = null

  /**
   * Returns an event source form a source (backend url)
   * @param source backend url
   */
  getServerEvent(source: string): EventSource{
    if(this.event == null){
      this.event = new EventSource(source)
      return this.event
    }
    return this.event
  }
}
