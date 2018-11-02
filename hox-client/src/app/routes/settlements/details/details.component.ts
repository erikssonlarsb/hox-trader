import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ApiService, ApiParams } from '../../../services/api/index';

import { Settlement } from '../../../models/index';

@Component({
  selector: 'app-settlement-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DatePipe]
})

export class SettlementDetailsComponent implements OnInit  {
  settlement: Settlement;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
    .paramMap
    .subscribe(params => {
      if(params.get('id')) {
        let settlementParams = new ApiParams({
          '$populate': [{
              path: 'counterpartySettlement',
              populate: {path: 'user'}
            },
            {
              path: 'trades',
              populate: {
                path: 'instrument',
                populate: {
                  path: 'prices',
                  match: { type: { $eq: 'SETTLEMENT'}}
                }
              }
            }
          ]
        });
        this.apiService.getSettlement(params.get('id'), settlementParams)
          .subscribe(
            settlement => this.settlement = settlement
          );
        }
      }
    )
  }
}
