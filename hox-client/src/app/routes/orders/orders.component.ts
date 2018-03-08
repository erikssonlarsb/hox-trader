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

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.ApiService.getOrders()
      .then((orders) => {
        this.orders = orders.sort((a: Order, b: Order) => {return a.createTimestamp.getDate() - b.createTimestamp.getDate()});
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  deleteOrder(id): void {
    this.ApiService.deleteOrder(id)
      .then(() => {
        this.ApiService.getOrders()
          .then((orders) => {
            this.orders = orders;
          })
          .catch(function(err) {
            console.log(err);
          });
      }).catch(function(err) {
        console.log(err);
      });
  }
}
