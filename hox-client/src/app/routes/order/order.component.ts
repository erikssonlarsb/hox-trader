import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api/api.service';

import { Instrument, Order, ORDER_SIDE } from '../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent  implements OnInit  {
  instrument: Instrument;
  side: ORDER_SIDE;
  quantity: number;
  price: number;
  order: Order;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getInstrument(this.route.snapshot.paramMap.get('instrument'))
      .then((instrument) => {
        this.instrument = instrument;
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  placeOrder(): void {
    this.apiService.postOrder(this.instrument.id, this.side, this.quantity, this.price)
      .then((order) => {
        this.order = order;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
