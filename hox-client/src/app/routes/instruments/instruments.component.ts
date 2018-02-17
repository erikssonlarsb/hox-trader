import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api/api.service';

import { OrderDepth } from '../../models/index';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent  implements OnInit  {
  orderDepths: Array<OrderDepth>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getOrderDepths()
      .then((orderDepths) => {
        this.orderDepths = orderDepths;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
