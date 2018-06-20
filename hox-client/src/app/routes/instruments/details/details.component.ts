import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService, ApiParams } from '../../../services/api/index';

import { DateOnlyPipe } from 'angular-date-only';

import { Instrument, OrderDepth, Price, Ticker } from '../../../models/index';

@Component({
  selector: 'app-instrument-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DateOnlyPipe]
})
export class InstrumentDetailsComponent  implements OnInit  {
  instrument: Instrument;
  orderDepth: OrderDepth;
  tickers: Array<Ticker>;

  chartData: Array<any>;
  chartLabels: Array<string>;

  constructor(private dateOnlyPipe: DateOnlyPipe, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {
    // TODO: Remove below when changed to other graph library that supports dynamic update.
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }
  }

  ngOnInit(): void {
    this.route
    .paramMap
    .subscribe(params => {
      let instrumentParams = new ApiParams({
        '$populate': ['underlying', 'prices', 'derivatives']
      });
      this.apiService.getInstrument(params.get('id'), instrumentParams)
      .subscribe(
        instrument => {
          this.instrument = instrument;
          this.chartData = new Array();
          this.chartLabels = new Array();
          this.chartData[0] = {data: new Array(), label: '', fill: false, lineTension: 0};
          instrument.prices.filter(price => price.type == 'CLOSE').forEach((price, index) => {
            this.chartData[0].data[index] = price.value;
            this.chartLabels[index] = this.dateOnlyPipe.transform(price.date);
          });

          // Add LAST price to time series if not same as latest CLOSE price.
          let lastPrice = instrument.prices.find(price => price.type == 'LAST');
          if(lastPrice && this.dateOnlyPipe.transform(lastPrice.date) != this.chartLabels[this.chartLabels.length-1]) {
            this.chartData[0].data.push(lastPrice.value);
            this.chartLabels.push(this.dateOnlyPipe.transform(lastPrice.date));
          }
        }
      );

      this.apiService.getOrderDepth(params.get('id'))
      .subscribe(
        orderDepth => this.orderDepth = orderDepth
      );

      let tickerParams = new ApiParams({
        'instrument': params.get('id'),
        '$limit': '5',
        '$populate': 'instrument'
      });
      this.apiService.getTickers(tickerParams)
      .subscribe(
        tickers => this.tickers = tickers
      );
    })
  }
}
