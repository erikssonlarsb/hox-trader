import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/index';
import { WebSocketService, DocumentEvent, DOCUMENT_OPERATION, DOCUMENT_TYPE } from '../../services/websocket/index';

import { Trade, Position, User } from '../../models/index';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent implements OnInit, OnDestroy  {
  user: User;
  trades: Array<Trade>;
  positions: Array<Position> = [];
  configOptions: any = {
    'hideSettled': {
      value: true,
      caption: "Hide settled",
      explanation: "Hides trades that's already been settled."
    }
  };

  constructor(private authService: AuthService, private ApiService: ApiService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    const populate = [
      'instrument',
      'user',
      {
        path: 'counterpartyTrade',
        populate: {path: 'user'}
      }
    ]

    this.webSocketService.populate('Trade', populate);

    this.webSocketService.events.subscribe(
      event => {
        if(event.docType == DOCUMENT_TYPE.Trade) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Create:
              this.trades.push(event.document);
              break;
            case DOCUMENT_OPERATION.Update:
              this.trades.forEach((trade, i) => {
                if(trade.id == event.document.id) this.trades[i] = event.document;
              });
              break;
          }
          this.calculatePositions();
        }
      }
    );

    this.ApiService.getTrades({'$populate': populate})
    .subscribe(trades => {
      this.trades = trades.sort((a: Trade, b: Trade) => {return a.createTimestamp.getTime() - b.createTimestamp.getTime()});
      this.calculatePositions();
    });

    // Get config from local storage and replace defaults.
    // Iterate and replace wtih stored settings in order to handle
    // the case when new default settings are added.
    let storedConfig = JSON.parse(localStorage.getItem("transactionsConfig"));
    for (let key in storedConfig) {
      if(this.configOptions[key]) {
        this.configOptions[key] = storedConfig[key];
      }
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("transactionsConfig", JSON.stringify(this.configOptions));
  }

  calculatePositions(): void {
    this.positions = [];
    for (let trade of this.trades) {
      let position = this.positions.find(position => position.instrument.id == trade.instrument.id && position.user.id == trade.user.id);
      if (!position) {
        this.positions.push(new Position({instrument: trade.instrument, user: trade.user, trades: [trade]}));
      } else {
        position.addTrade(trade);
      }
    }
    this.positions = this.positions.sort((a: Position, b: Position) => {
      if(a.instrument.name < b.instrument.name) return -1;
      if(a.instrument.name > b.instrument.name) return 1;
      return 0;
    });
  }
}
