import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ApiService } from '../../../services/api/api.service';

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
        this.apiService.getSettlement(params.get('id'))
          .subscribe(
            settlement => this.settlement = settlement
          );
        }
      }
    )
  }
}
