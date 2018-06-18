import { Component, OnInit } from '@angular/core';

import { ApiService, ApiParams } from '../../services/api/index';

import { OrderDepth, Instrument, Ticker } from '../../models/index';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getOrderDepths({'status': 'ACTIVE','$populate': ['prices', 'underlying']})
    .subscribe(
      orderDepths => this.orderDepths = orderDepths.sort((a: OrderDepth, b: OrderDepth) => {
        if(a.instrument.name < b.instrument.name) return -1;
        if(a.instrument.name > b.instrument.name) return 1;
        return 0;
      })
    );

    let tickerParams = new ApiParams({
        '$limit': '15',
        '$populate': {
          path: 'instrument',
          populate: {
            path: 'underlying'
          }
        }
    });
    this.apiService.getTickers(tickerParams)
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
