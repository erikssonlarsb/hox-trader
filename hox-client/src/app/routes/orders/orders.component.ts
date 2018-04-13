import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Order, User } from '../../models/index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit  {
  user: User;
  orders: Array<Order>;
  hideExpired: boolean = true;
  dateNow: Date = new Date();

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.ApiService.getOrders()
      .subscribe(
        orders => this.orders = orders.sort((a: Order, b: Order) => {return a.createTimestamp.getTime() - b.createTimestamp.getTime()})
      );
  }

  deleteOrder(id): void {
    this.ApiService.deleteOrder(id)
      .subscribe(() => {
        this.ApiService.getOrders()
          .subscribe(
            orders => this.orders = orders
          )
      })
  }
}
