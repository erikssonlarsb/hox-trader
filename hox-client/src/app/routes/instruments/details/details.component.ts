import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams }  from '@angular/common/http';

import { ApiService } from '../../../services/api/api.service';

import { DateOnlyPipe } from 'angular-date-only';

import { Instrument, OrderDepth, Price } from '../../../models/index';

@Component({
  selector: 'app-instrument-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DateOnlyPipe]
})
export class InstrumentDetailsComponent  implements OnInit  {
  instrument: Instrument;
  orderDepth: OrderDepth;

  chartData: Array<any>;
  chartLabels: Array<string>;

  constructor(private dateOnlyPipe: DateOnlyPipe, private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
    .paramMap
    .subscribe(params => {
      this.apiService.getInstrument(params.get('id'))
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

          }
        );

      this.apiService.getOrderDepth(params.get('id'))
        .subscribe(
          orderDepth => this.orderDepth = orderDepth
        );
    })
  }
}
