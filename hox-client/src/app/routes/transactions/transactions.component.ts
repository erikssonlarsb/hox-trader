import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import {Trade } from '../../models/index';
import { User } from '../../services/auth/payload';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent implements OnInit  {
  user: User;
  trades: Array<Trade>;

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.ApiService.getTrades()
      .then((trades) => {
        this.trades = trades.sort((a: Trade, b: Trade) => {return a.createTimestamp.getDate() - b.createTimestamp.getDate()});
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
