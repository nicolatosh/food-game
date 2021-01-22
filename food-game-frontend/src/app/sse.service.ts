import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor() { }

  /**
   * Returns an event source form a source (backend url)
   * @param source backend url
   */
  getServerEvent(source: string): EventSource{
    return new EventSource(source)
  }
}
