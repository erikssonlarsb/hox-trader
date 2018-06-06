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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.firstVisit = localStorage.getItem('firstVisit') != null ? JSON.parse(localStorage.getItem('firstVisit')) : true;
    this.apiService.getOrderDepths(new HttpParams().set('status', 'ACTIVE'))
      .subscribe(
        orderDepths => this.orderDepths = orderDepths
      );

    let instrumentParams = new HttpParams({
      fromObject: {
        'type': 'Index',
        '_populate': 'prices'
      }
    });
    this.apiService.getInstruments(instrumentParams)
      .subscribe(
        instruments => this.indices = instruments
      );
  }

  dismissInfo(): void {
    localStorage.setItem('firstVisit', JSON.stringify(false));
  }
}
