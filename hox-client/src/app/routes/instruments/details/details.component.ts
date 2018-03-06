import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams }  from '@angular/http';
import { DatePipe } from '@angular/common';

import { ApiService } from '../../../services/api/api.service';

import { Instrument, OrderDepth, Price } from '../../../models/index';

@Component({
  selector: 'app-instrument-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DatePipe]
})
export class InstrumentDetailsComponent  implements OnInit  {
  instrument: Instrument;
  orderDepth: OrderDepth;
  last: Price;
  high: Price;
  low: Price;
  historic: Array<Price>;

  chartData: Array<any>;
  chartLabels: Array<string>;

  constructor(private datePipe: DatePipe, private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
    .paramMap
    .subscribe(params => {
      if(params.get('id')) {  // Retrieve existing order
        this.apiService.getInstrument(params.get('id'))
          .then((instrument) => {
            this.instrument = instrument;
          })
          .catch(function(err) {
            console.log(err);
          });

        this.apiService.getOrderDepth(params.get('id'))
          .then((orderDepth) => {
            this.orderDepth = orderDepth;
          })
          .catch(function(err) {
            console.log(err);
          });

        let priceParams = new URLSearchParams();
        priceParams.append('instrument', params.get('id'));
        this.apiService.getPrices(priceParams)
        .then((prices) => {
          this.last = prices.find(price => price.type == 'LAST');
          this.high = prices.find(price => price.type == 'HIGH');
          this.low = prices.find(price => price.type == 'LOW');

          this.historic = prices.filter(price => price.type == 'CLOSE');
          this.chartData = new Array();
          this.chartLabels = new Array();
          this.chartData[0] = {data: new Array(), label: '', fill: false, lineTension: 0};
          this.historic.forEach((price, index) => {
            this.chartData[0].data[index] = price.value;
            this.chartLabels[index] = this.datePipe.transform(price.date);
          });
        })
        .catch(function(err) {
          console.log(err);
        });
      }
    })
  }
}
