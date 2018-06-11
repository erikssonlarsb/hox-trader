import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpParams }  from '@angular/common/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Order, User } from '../../models/index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit, OnDestroy  {
  user: User;
  orders: Array<Order>;
  configOptions: Object;

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

    // Get config from local storage, or initialize new if not stored.
    this.configOptions = JSON.parse(localStorage.getItem("ordersConfig"));
    if (!this.configOptions) {
      this.configOptions = {
        'hideExpiredInstruments': {
          value: true,
          caption: "Hide expired instruments",
          explanation: "Hides orders in expired instruments."
        },
        'hideNonActiveOrders': {
          value: true,
          caption: "Hide non-active orders",
          explanation: "Hides orders that are not in state Active."
        }
      };
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
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
    });
  }

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("ordersConfig", JSON.stringify(this.configOptions));
  }
}
