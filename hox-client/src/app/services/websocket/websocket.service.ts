import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth/auth.service';

import { Event, EVENT_TYPE, ConnectionEvent, CONNECTION_STATUS, DocumentEvent, DOCUMENT_OPERATION } from './event';

@Injectable()
export class WebSocketService {
  private socket: WebSocket;
  private eventSource: Subject<DocumentEvent> = new Subject<DocumentEvent>();
  private populateMessages: any = {};

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

          // Create WebSocket connection.
          this.connect(token);
        }
      }
    )
  }

  private connect(token: string): void {
    this.socket = new WebSocket(
      `${window.location.protocol == 'http:' ? 'ws' : 'wss'}://${window.location.host}/ws`,
      [token]
    );

    // Connection opened
    this.socket.addEventListener(
    'open', (openEvent) => {
      for(let message of Object.values(this.populateMessages)) {
        this.socket.send(JSON.stringify(message));
      }
    });

    // Listen for messages
    this.socket.addEventListener(
    'message', (messageEvent: MessageEvent) => {
      let event: Event = Event.typeMapper(JSON.parse(messageEvent.data));
      switch (event.type) {
        case EVENT_TYPE.Connection:
          break;
        case EVENT_TYPE.Document:
          this.eventSource.next(<DocumentEvent> event);
          break;
      }
    });

    // Connection closed
    this.socket.addEventListener(
    'close', (closeEvent: CloseEvent) => {
      if(!closeEvent.wasClean) {
        // Reconnect after 3000 ms
        setTimeout(() => this.connect(token), 3000);

      }
    });
  }

  populate(docType: string, populate: Array<any> = []): void {
    const populateMessage = {type: 'Populate', data: {docType: docType, populate: populate}};
    this.populateMessages[docType] = populateMessage;
      if(this.socket.readyState == 1) {
      this.socket.send(JSON.stringify(populateMessage));
    }
  }
}
