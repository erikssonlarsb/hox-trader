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
  instruments: Array<Instrument>;
  instrument: string;
  side: ORDER_SIDE;
  quantity: number;
  price: number;
  order: Order;
  error: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
      .paramMap
      .subscribe(params => {
        console.log(params);
        console.log(params.get('id'));
        if(params.get('id')) {  // Retrieve existing order
          this.apiService.getOrder(params.get('id'))
            .then((order) => {
              this.order = order;
              this.instrument = order.instrument.name;
              this.side = order.side;
              this.quantity = order.quantity - order.tradedQuantity;
              this.price = order.price;
            })
            .catch(function(err) {
              console.log(err);
            });
        } else if(params.get('instrument')) {  // Populate details from router params
          this.apiService.getInstrument(params.get('instrument'))
            .then((instrument) => {
              this.instrument = instrument.name;
              this.instruments = [instrument];
            })
            .catch(function(err) {
              console.log(err);
            });
          this.side = ORDER_SIDE[params.get('side')];
          this.quantity = Number(params.get('quantity'));
          this.price = Number(params.get('price'));
        } else {  // Get all instruments for client to fill in order details
          this.apiService.getInstruments()
            .then((instruments) => {
              this.instruments = instruments;
            })
            .catch(function(err) {
              console.log(err);
            });
        }
      });
  }

  //TODO: Should work by model binding
  onSideChange(side): void {
    this.side = side;
  }

  placeOrder(): void {
    this.error = null;  // Reset error message

    //TODO: Should be form validation on required fields.
    if(this.instrument == null) {
      this.error = "No instrument selected";
      return;
    }
    var instrumentId = this.instruments.filter(
      instrument => instrument.name == this.instrument)[0].id;
    this.apiService.postOrder(instrumentId, this.side, this.quantity, this.price)
      .then((order) => {
        this.order = order;
      })
      .catch((error) => {
        console.log(error);
        this.error = error.message;
      });
  }
}
