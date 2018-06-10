import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams }  from '@angular/common/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Trade, User } from '../../models/index';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent implements OnInit, OnDestroy  {
  user: User;
  trades: Array<Trade>;
  configOptions: Object;

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
    });

    // Get config from local storage, or initialize new if not stored.
    this.configOptions = JSON.parse(localStorage.getItem("transactionsConfig"));
    if (!this.configOptions) {
      this.configOptions = {
        'hideSettled': {
          value: true,
          caption: "Hide settled",
          explanation: "Hides traded that has already been settled."
        }
      };
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("transactionsConfig", JSON.stringify(this.configOptions));
  }
}
