import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams }  from '@angular/common/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

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

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    let tradeParams = new HttpParams({
      fromObject: {
        '_populate': ['instrument', 'user', 'counterpartyTrade']
      }
    });
    this.ApiService.getTrades(tradeParams)
    .subscribe(trades => {
      this.trades = trades.sort((a: Trade, b: Trade) => {return a.updateTimestamp.getTime() - b.updateTimestamp.getTime()});
      for (let trade of this.trades) {
        let position = this.positions.find(position => position.instrument.id == trade.instrument.id);
        if (!position) {
          this.positions.push(new Position({instrument: trade.instrument, trades: [trade]}));
        } else {
          position.addTrade(trade);
        }
      }
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
}
