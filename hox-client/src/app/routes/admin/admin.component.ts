import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams }  from '@angular/http';

import { ApiService } from '../../services/api/api.service';

import { Instrument, INSTRUMENT_TYPE, PRICE_TYPE, User } from '../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  implements OnInit  {
  indices: Array<Instrument>;
  minDate: string = new Date().toISOString().slice(0,10);
  expiry: Date;
  index: string;
  createDerivativeStatusMessage: string;
  createDerivativeErrorMessage: string;

  derivatives: Array<Instrument>;
  derivative: string;
  settlementDate: Date;
  settlementValue: number;
  addSettlementPriceStatusMessage: string;
  addSettlementPriceErrorMessage: string;

  jobs: Array<string>;
  job: string;
  runJobStatusMessage: string;
  runJobErrorMessage: string;

  users: Array<User>;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    let indexParams = new URLSearchParams();
    indexParams.append('type', 'INDEX');
    this.apiService.getInstruments(indexParams)
    .then((indices) => {
      this.indices = indices;
    });

    let derivativeParams = new URLSearchParams();
    derivativeParams.append('type', 'FORWARD');
    this.apiService.getInstruments(derivativeParams)
    .then((derivatives) => {
      this.derivatives = derivatives;
    });

    this.apiService.getJobs()
    .then((jobs) => {
      this.jobs = jobs;
    });

    this.apiService.getUsers()
    .then((users) => {
      this.users = users;
    });
  }

  createDerivative(): void {
    this.createDerivativeStatusMessage = null;  // Reset status message
    this.createDerivativeErrorMessage = null;  // Reset error message

    var instrumentId = this.indices.filter(instrument => instrument.name == this.index)[0].id;
    this.apiService.postInstrument(null, INSTRUMENT_TYPE.FORWARD, instrumentId, this.expiry)
      .then((instrument) => {
        this.createDerivativeStatusMessage = instrument.name + " successfully created."
      })
      .catch((error) => {
        this.createDerivativeErrorMessage = error;
      });
  }

  derivativeOnSelect(event): void {
    var settlementPrice = event.item.prices.filter(price => price.type == 'SETTLEMENT');
    if (settlementPrice.length > 0) {
      this.settlementDate = settlementPrice[0].date;
      this.settlementValue = settlementPrice[0].value;
    } else {
      this.settlementDate = null;
      this.settlementValue = null;
    }
  }

  addSettlementPrice(): void {
    this.addSettlementPriceStatusMessage = null;  // Reset status message
    this.addSettlementPriceErrorMessage = null;  // Reset error message

    var instrumentId = this.derivatives.filter(instrument => instrument.name == this.derivative)[0].id;
    this.apiService.postPrice(instrumentId, PRICE_TYPE.SETTLEMENT, this.settlementDate, this.settlementValue)
      .then((price) => {
        this.addSettlementPriceStatusMessage = "Settlement price successfully created."
      })
      .catch((error) => {
        this.addSettlementPriceErrorMessage = error;
      });
  }

  runJob(): void {
    this.runJobStatusMessage = null;  // Reset status message
    this.runJobErrorMessage = null;  // Reset error message

    this.apiService.runJob(this.job)
      .then((info) => {
        this.runJobStatusMessage = this.job + " successfully initiated."
      })
      .catch((error) => {
        this.runJobErrorMessage = error;
      });
  }

  userOnSelect(event): void {
    this.router.navigate(['/users', event.item.id]);
  }
}
