import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth/auth.service';

import { Event } from './event';

@Injectable()
export class WebSocketService {
  private socket: Subject<any>;
  private eventSource: Subject<Event> = new Subject<Event>();

  events: Observable<Event> = this.eventSource.asObservable();

  constructor(private authService: AuthService) {
    this.init();
  }

  private init(): void {
    this.authService.loginChanged
    .subscribe(
      (loggedIn: boolean) => {
        if(loggedIn) {
          const token = this.authService.getToken();
          this.socket = Observable.webSocket({
            url: `ws://${window.location.host}/ws`,
            protocol: [token]
          });

          this.socket
          .retry()
          .map(message => new Event(message))
          .subscribe(
            (event) => this.eventSource.next(event),
            (err) => console.error(err),
            () => console.log('Completed!')
          );
        } else {

        }
      }
    )
  }

  populate(docType: string, populate: Array<any>): void {
    this.socket.next(JSON.stringify({type: 'Populate', data: {docType: docType, populate: populate}}));
  }
}
