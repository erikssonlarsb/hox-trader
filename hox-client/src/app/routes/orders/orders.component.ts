import { Component, OnInit } from '@angular/core';
import { HttpParams }  from '@angular/common/http';

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
  hideInactive: boolean = true;
  dateNow: Date = new Date();

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    let orderParams = new HttpParams({
      fromObject: {
        '_populate': ['user', 'instrument']
      }
    });
    this.ApiService.getOrders(orderParams)
      .subscribe(
        orders => this.orders = orders.sort((a: Order, b: Order) => {return a.updateTimestamp.getTime() - b.updateTimestamp.getTime()})
      );
  }

  withdrawOrder(id): void {
    this.ApiService.withdrawOrder(id)
      .subscribe(() => {
        let orderParams = new HttpParams({
          fromObject: {
            '_populate': ['user', 'instrument']
          }
        });
        this.ApiService.getOrders(orderParams)
          .subscribe(
            orders => this.orders = orders
          )
      })
  }
}
