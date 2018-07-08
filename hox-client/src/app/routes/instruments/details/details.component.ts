import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService, ApiParams } from '../../../services/api/index';
import { WebSocketService, DocumentEvent, DOCUMENT_OPERATION, DOCUMENT_TYPE } from '../../../services/websocket/index';

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
  prices: Array<Price>;
  orderDepth: OrderDepth;
  tickers: Array<Ticker>;

  chartData: Array<any>;
  chartLabels: Array<string>;
  chartOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: 30
        }
      }]
    }
  }

  constructor(private dateOnlyPipe: DateOnlyPipe, private router: Router, private route: ActivatedRoute, private apiService: ApiService, private webSocketService: WebSocketService) {
    // TODO: Remove below when changed to other graph library that supports dynamic update.
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }
  }

  ngOnInit(): void {
    this.route
    .paramMap
    .subscribe(params => {
      this.webSocketService.populate('Instrument', ['underlying', 'derivatives']);
      this.webSocketService.populate('Price');
      this.webSocketService.populate('OrderDepth');
      this.webSocketService.populate('Ticker');

      this.webSocketService.events.subscribe(
        event => {
          if(event.docType == DOCUMENT_TYPE.Instrument && event.document.id == params.get('id')) {
            switch(event.operation) {
              case DOCUMENT_OPERATION.Update:
                this.instrument = event.document;
            }
          } else if(event.docType == DOCUMENT_TYPE.Price && event.document.instrument.id == params.get('id')) {
            switch (event.operation) {
              case DOCUMENT_OPERATION.Create:
                this.prices.push(event.document);
                break;
              case DOCUMENT_OPERATION.Update:
                this.prices.forEach((price, i) => {
                  if(price.type == event.document.type) {
                    this.prices[i] = event.document;
                  }
                });
                break;
            }
            this.updateChart();
          } else if(event.docType == DOCUMENT_TYPE.OrderDepth && event.document.instrument.id == params.get('id')) {
            switch(event.operation) {
              case DOCUMENT_OPERATION.Update:
              this.orderDepth = event.document;
            }
          } else if(event.docType == DOCUMENT_TYPE.Ticker && event.document.instrument.id == params.get('id')) {
            this.tickers.unshift(event.document);
            if(this.tickers.length > 5) {
              this.tickers.pop();
            }
          }
        }
      );

      let instrumentParams = new ApiParams({
        '$populate': ['underlying', 'derivatives']
      });
      this.apiService.getInstrument(params.get('id'), instrumentParams)
      .subscribe(
        instrument => {
          this.instrument = instrument;
        }
      );

      this.apiService.getPrices({'instrument': params.get('id')})
      .subscribe(
        prices => {
          this.prices = prices;
          this.updateChart();
        }
      );

      this.apiService.getOrderDepth(params.get('id'))
      .subscribe(
        orderDepth => this.orderDepth = orderDepth
      );

      let tickerParams = new ApiParams({
        'instrument': params.get('id'),
        '$limit': '5'
      });
      this.apiService.getTickers(tickerParams)
      .subscribe(
        tickers => this.tickers = tickers
      );
    });
  }

  private updateChart(): void {
    this.chartData = new Array();
    this.chartLabels = new Array();
    this.chartData[0] = {data: new Array(), label: '', fill: false, lineTension: 0};
    this.prices.filter(price => price.type == 'CLOSE').forEach((price, index) => {
      this.chartData[0].data[index] = price.value;
      this.chartLabels[index] = this.dateOnlyPipe.transform(price.date);
    });

    // Add LAST price to time series if not same as latest CLOSE price.
    let lastPrice = this.prices.find(price => price.type == 'LAST');
    if(lastPrice && this.dateOnlyPipe.transform(lastPrice.date) != this.chartLabels[this.chartLabels.length-1]) {
      this.chartData[0].data.push(lastPrice.value);
      this.chartLabels.push(this.dateOnlyPipe.transform(lastPrice.date));
    }
  }
}
