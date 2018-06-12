import { Component, OnInit } from '@angular/core';
import { HttpParams }  from '@angular/common/http';

import { ApiService } from '../../services/api/api.service';

import { OrderDepth, Instrument } from '../../models/index';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent  implements OnInit  {
  orderDepths: Array<OrderDepth>;
  indices: Array<Instrument>;
  reVisit: boolean = true;
  orderDepthFilter: string = null;
  configSpin: boolean = false;
  configOptions: Object = {
    'classicView': {
      value: false,
      caption: "Classic view",
      explanation: "Show classic market overview table."
    }
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    let orderDepthParams = new HttpParams({
      fromObject: {
        'status': 'ACTIVE',
        '_populate': 'prices'
      }
    });
    this.apiService.getOrderDepths(orderDepthParams)
    .subscribe(
      orderDepths => this.orderDepths = orderDepths
    );

    let indexParams = new HttpParams({
      fromObject: {
        'type': 'Index',
        '_populate': 'prices'
      }
    });
    this.apiService.getInstruments(indexParams)
    .subscribe(
      instruments => this.indices = instruments
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
      this.configOptions[key] = storedConfig[key];
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
