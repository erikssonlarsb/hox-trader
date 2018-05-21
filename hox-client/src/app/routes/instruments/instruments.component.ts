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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getOrderDepths(new HttpParams().set('status', 'ACTIVE'))
      .subscribe(
        orderDepths => this.orderDepths = orderDepths
      );

    this.apiService.getInstruments(new HttpParams().set('status', 'INACTIVE'))
      .subscribe(
        instruments => this.indices = instruments
      );
  }
}
