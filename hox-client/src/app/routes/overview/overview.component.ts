import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../services/auth/payload';
import { ApiService } from '../../services/api/api.service';

import { Instrument, Order, Trade } from '../../models/index';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent  implements OnInit  {
  private user: User;
  instrumentColumns = ['name', 'expiry'];
  orderColumns = ['instrument', 'side', 'price', 'quantity', 'tradedQuantity', 'status'];
  tradeColumns = ['instrument', 'side', 'price', 'quantity', 'counterparty'];
  instruments: MatTableDataSource<Instrument>;
  orders: MatTableDataSource<Order>;
  trades: MatTableDataSource<Trade>;

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    this.ApiService.getInstruments()
      .then((response) => {
        this.instruments = new MatTableDataSource<Instrument>(response);
      })
      .catch(function(err) {
        console.log(err);
      });

    this.ApiService.getOrders()
      .then((response) => {
        this.orders = new MatTableDataSource<Order>(response);
      })
      .catch(function(err) {
        console.log(err);
      });

    this.ApiService.getTrades()
      .then((response) => {
        this.trades = new MatTableDataSource<Trade>(response);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
