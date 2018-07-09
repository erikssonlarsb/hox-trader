import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, group, query } from '@angular/animations';

import { ApiService } from '../../services/api/index';
import { WebSocketService, DocumentEvent, DOCUMENT_OPERATION, DOCUMENT_TYPE } from '../../services/websocket/index';

import { OrderDepth, Instrument, INSTRUMENT_TYPE, Ticker } from '../../models/index';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css'],
  animations: [
  trigger('valueChange', [
    transition(':increment', group([
      query(':enter', [
        style({ color: 'green', 'font-weight': 'bold'}),
        animate('10s', style('*'))
      ])
    ])),
    transition(':decrement', group([
      query(':enter', [
        style({ color: 'red', 'font-weight': 'bold'}),
        animate('10s', style('*'))
      ])
    ]))
  ])
]
})
export class InstrumentsComponent  implements OnInit  {
  orderDepths: Array<OrderDepth>;
  tickers: Array<Ticker>;
  indices: Array<Instrument>;
  reVisit: boolean = true;
  orderDepthFilter: string = null;
  configSpin: boolean = false;
  configOptions: any = {
    'classicView': {
      value: false,
      caption: "Classic view",
      explanation: "Show classic market overview table."
    }
  };

  constructor(private apiService: ApiService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.populate('OrderDepth', [{path: 'instrument', populate: [{path: 'underlying'}, {path: 'prices', match: { type: { $eq: 'LAST'}}}]}]);
    this.webSocketService.populate('Ticker', [{path: 'instrument', populate: {path: 'underlying'}}]);
    this.webSocketService.populate('Instrument', ['prices']);

    this.webSocketService.events.subscribe(
      event => {
        if(event.docType == DOCUMENT_TYPE.OrderDepth) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Create:
              this.orderDepths.push(event.document);
              this.orderDepths.sort((a: OrderDepth, b: OrderDepth) => {
                if(a.instrument.name < b.instrument.name) return -1;
                if(a.instrument.name > b.instrument.name) return 1;
                return 0;
              });
              break;
            case DOCUMENT_OPERATION.Update:
              this.orderDepths.forEach((orderDepth, i) => {
                if(orderDepth.instrument.id == event.document.instrument.id) {
                  this.orderDepths[i].instrument = event.document.instrument;
                  this.orderDepths[i].levels = event.document.levels;
                }
              });
              break;
            case DOCUMENT_OPERATION.Delete:
              this.orderDepths.forEach((orderDepth, i) => {
                if(orderDepth.instrument.id == event.document.instrument.id) this.orderDepths.splice(i, 1);
              });
              break;
          }
        } else if(event.docType == DOCUMENT_TYPE.Ticker) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Create:
              this.tickers.unshift(event.document);
              if(this.tickers.length > 15) {
                this.tickers.pop();
              }
              break;
          }
        } else if(event.docType == DOCUMENT_TYPE.Instrument) {
          if(event.document.type == INSTRUMENT_TYPE.Index) {
            switch (event.operation) {
              case DOCUMENT_OPERATION.Create:
                this.indices.push(event.document);
                this.indices.sort((a: Instrument, b: Instrument) => {
                  if(a.name < b.name) return -1;
                  if(a.name > b.name) return 1;
                  return 0;
                });
                break;
              case DOCUMENT_OPERATION.Update:
                this.indices.forEach((index, i) => {
                  if(index.id == event.document.id) this.indices[i] = event.document;
                });
                break;
            }
          } else if(event.document.type == INSTRUMENT_TYPE.Derivative) {
            switch (event.operation) {
              case DOCUMENT_OPERATION.Update:
                this.orderDepths.forEach((orderDepth, i) => {
                  if(orderDepth.instrument.id == event.document.id) {
                    this.orderDepths[i].instrument = event.document;
                  }
                });
                break;
            }
          }
        }
      }
    );

    this.apiService.getOrderDepths({
      'type': 'Derivative',
      '$populate': {path: 'instrument', populate: [{path: 'underlying'}, {path: 'prices', match: { type: { $eq: 'LAST'}}}]}
    })
    .subscribe(
      orderDepths => this.orderDepths = orderDepths.sort((a: OrderDepth, b: OrderDepth) => {
        if(a.instrument.name < b.instrument.name) return -1;
        if(a.instrument.name > b.instrument.name) return 1;
        return 0;
      })
    );

    this.apiService.getTickers({
        '$limit': '15',
        '$populate': {path: 'instrument', populate: {path: 'underlying'}}
    })
    .subscribe(
      tickers => this.tickers = tickers
    );

    this.apiService.getInstruments({'type': 'Index','$populate': 'prices'})
    .subscribe(
      instruments => this.indices = instruments.sort((a: Instrument, b: Instrument) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      })
    );

    this.reVisit = JSON.parse(localStorage.getItem('reVisit')) || false;
    // Spin config cog for 10 s to raise awareness on first visit.
    if (!this.reVisit) {
      this.configSpin = true;
      setTimeout(() => this.configSpin = false, 10000);
    }

    // Get config from local storage and replace defaults.
    // Iterate and replace wtih stored settings in order to handle
    // the case when new default settings are added.
    let storedConfig = JSON.parse(localStorage.getItem("instrumentsConfig"));
    for (let key in storedConfig) {
      if(this.configOptions[key]) {
        this.configOptions[key] = storedConfig[key];
      }
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  dismissInfo(): void {
    localStorage.setItem('reVisit', JSON.stringify(true));
  }

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("instrumentsConfig", JSON.stringify(this.configOptions));
  }
}
