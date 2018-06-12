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
  firstVisit: boolean = true;
  orderDepthFilter: string = null;
  configOptions: Object;
  configSpin: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.firstVisit = localStorage.getItem('firstVisit') != null ? JSON.parse(localStorage.getItem('firstVisit')) : true;

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

    // Get config from local storage, or initialize new if not stored.
    this.configOptions = JSON.parse(localStorage.getItem("instrumentsConfig"));
    if (!this.configOptions) {
      this.configOptions = {
        'classicView': {
          value: false,
          caption: "Classic view",
          explanation: "Show classic market overview table."
        }
      };
    }

    // Spin config cog for 10 s to raise awareness.
    if (this.firstVisit) {
      this.configSpin = true;
      setTimeout(() => this.configSpin = false, 10000);
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  dismissInfo(): void {
    localStorage.setItem('firstVisit', JSON.stringify(false));
  }

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("instrumentsConfig", JSON.stringify(this.configOptions));
  }
}
