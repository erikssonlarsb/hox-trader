import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api/api.service';

import { OrderDepth } from '../../models/index';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent  implements OnInit  {
  orderDepths: Array<OrderDepth>;

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.ApiService.getOrderDepths()
      .then((orderDepths) => {
        this.orderDepths = orderDepths;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
