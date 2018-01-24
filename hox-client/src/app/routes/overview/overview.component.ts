import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../services/auth/payload';
import { ApiService } from '../../services/api/api.service';

import { OrderDepth, Order, Trade } from '../../models/index';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent  implements OnInit  {
  private user: User;
  orderDepthColumns = ['instrument', 'expiry', 'buyQuantity', 'buyPrice', 'sellPrice', 'sellQuantity'];
  orderColumns = ['instrument', 'side', 'price', 'quantity', 'tradedQuantity', 'status'];
  tradeColumns = ['instrument', 'side', 'price', 'quantity', 'counterparty'];
  orderDepths: MatTableDataSource<OrderDepth>;
  orders: MatTableDataSource<Order>;
  trades: MatTableDataSource<Trade>;

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    this.ApiService.getOrderDepths()
      .then((response) => {
        this.orderDepths = new MatTableDataSource<OrderDepth>(response);
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

  clickInstrument(orderDepth: OrderDepth): void {
    console.log(orderDepth.instrument);
  }
}
