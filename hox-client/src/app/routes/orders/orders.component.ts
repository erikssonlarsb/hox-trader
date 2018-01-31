import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api/api.service';

import { Order } from '../../models/index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit  {
  orders: Array<Order>;

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.ApiService.getOrders()
      .then((orders) => {
        this.orders = orders;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
