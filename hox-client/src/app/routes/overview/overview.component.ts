import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  orderDepths: Array<OrderDepth>;
  orders: Array<Order>;
  trades: Array<Trade>;

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.ApiService.getOrderDepths()
      .then((orderDepths) => {
        this.orderDepths = orderDepths;
      })
      .catch(function(err) {
        console.log(err);
      });

    this.ApiService.getOrders()
      .then((orders) => {
        this.orders = orders;
      })
      .catch(function(err) {
        console.log(err);
      });

    this.ApiService.getTrades()
      .then((trades) => {
        this.trades = trades;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
