import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api/api.service';

import { Instrument, Order, ORDER_SIDE } from '../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent  implements OnInit  {
  instruments: Array<Instrument>;
  instrument: string;
  side: ORDER_SIDE;
  quantity: number;
  price: number;
  order: Order;
  errorMessage: string;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
      .paramMap
      .subscribe(params => {
        if(params.get('id')) {  // Retrieve existing order
          this.apiService.getOrder(params.get('id'))
            .subscribe(order => {
              this.order = order;
              this.instrument = order.instrument.name;
              this.side = order.side;
              this.quantity = order.quantity - order.tradedQuantity;
              this.price = order.price;
            });
        } else if(params.get('instrument')) {  // Populate details from router params
          this.apiService.getInstrument(params.get('instrument'))
            .subscribe(instrument => {
              this.instrument = instrument.name;
              this.instruments = [instrument];
            });
          this.side = ORDER_SIDE[params.get('side')];
          this.quantity = Number(params.get('quantity')) | 0;
          this.price = Number(params.get('price')) | 0;
        } else {  // Get all instruments for client to fill in order details
          this.apiService.getInstruments()
            .subscribe(
              instruments => this.instruments = instruments
            );
        }
      });
  }

  //TODO: Should work by model binding
  onSideChange(side): void {
    this.side = side;
  }

  placeOrder(): void {
    this.errorMessage = null;  // Reset error message

    //TODO: Should be form validation on required fields.
    if(!this.instrument) {
      this.errorMessage = "No instrument selected";
      return;
    }
    let instrument = this.instruments.find(instrument => instrument.name == this.instrument);
    let newOrder = new Order({instrument: instrument, side: this.side, quantity: this.quantity, price: this.price});
    this.apiService.postOrder(newOrder)
      .subscribe(
        order => this.router.navigate(['/orders'])
      );
  }
}
