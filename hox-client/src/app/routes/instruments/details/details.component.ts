import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';

import { Instrument, OrderDepth } from '../../../models/index';

@Component({
  selector: 'app-instrument-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class InstrumentDetailsComponent  implements OnInit  {
  instrument: Instrument;
  orderDepth: OrderDepth;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

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
      }
    })
  }
}
