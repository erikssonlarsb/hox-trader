import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth/auth.service';

import { Event, EVENT_TYPE, ConnectionEvent, CONNECTION_STATUS, DocumentEvent, DOCUMENT_OPERATION } from './event';

@Injectable()
export class WebSocketService {
  private socket: Subject<any>;
  private eventSource: Subject<DocumentEvent> = new Subject<DocumentEvent>();
  private populateMessages: any = {};
  private connectionStatus: CONNECTION_STATUS = CONNECTION_STATUS.Disconnected;

  events: Observable<DocumentEvent> = this.eventSource.asObservable();

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
            url: `${window.location.protocol == 'http:' ? 'ws' : 'wss'}://${window.location.host}/ws`,
            protocol: [token]
          });

          this.socket
          .retry()
          .map(event => Event.typeMapper(event))
          .subscribe(
            (event) => {
              switch (event.type) {
                case EVENT_TYPE.Connection:
                  const connectionEvent = <ConnectionEvent> event;
                  this.connectionStatus = connectionEvent.status;
                  if(connectionEvent.status == CONNECTION_STATUS.Connected) {
                    for(let message of Object.values(this.populateMessages)) {
                      this.socket.next(JSON.stringify(message));
                    }
                  }
                  break;
                case EVENT_TYPE.Document:
                  this.eventSource.next(<DocumentEvent> event);
                  break;
              }
            },
            (err) => console.error(err),
            () => console.log('Completed!')
          );
        }
      }
    )
  }

  populate(docType: string, populate: Array<any>): void {
    const populateMessage = {type: 'Populate', data: {docType: docType, populate: populate}};
    this.populateMessages[docType] = populateMessage;
    if(this.connectionStatus == CONNECTION_STATUS.Connected) {
      this.socket.next(JSON.stringify(populateMessage));
    }
  }
}
