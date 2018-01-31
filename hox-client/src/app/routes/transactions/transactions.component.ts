import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api/api.service';

import {Trade } from '../../models/index';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit  {
  transactions: Array<Trade>;

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.ApiService.getTrades()
      .then((trades) => {
        this.transactions = trades;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
