import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Trade, User } from '../../models/index';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent implements OnInit  {
  user: User;
  trades: Array<Trade>;
  hideSettled: boolean = true;

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.ApiService.getTrades()
      .subscribe(trades => {
        this.trades = trades.sort((a: Trade, b: Trade) => {return a.updateTimestamp.getTime() - b.updateTimestamp.getTime()});
      });
  }
}
