import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams }  from '@angular/common/http';

import { ApiService } from '../../services/api/api.service';

import { Instrument, Index, Derivative, Price, PRICE_TYPE, User } from '../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  implements OnInit  {
  indices: Array<Index>;
  minDate: string = new Date().toISOString().slice(0,10);
  expiry: Date;
  index: string;
  createDerivativeStatusMessage: string;
  createDerivativeErrorMessage: string;

  derivatives: Array<Derivative>;
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
  user: User;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getInstruments(new HttpParams().set('type', 'Index'))
      .subscribe(
        instruments => this.indices = <Index[]> instruments
      );

    this.apiService.getInstruments(new HttpParams().set('type', 'Derivative'))
      .subscribe(
        instruments => this.derivatives = <Derivative[]> instruments
      );

    this.apiService.getJobs()
      .subscribe(
        jobs => this.jobs = jobs
      );

    this.apiService.getUsers()
      .subscribe(
        users => this.users = users
      );
  }

  createDerivative(): void {
    this.createDerivativeStatusMessage = null;  // Reset status message
    this.createDerivativeErrorMessage = null;  // Reset error message

    let underlying = this.indices.find(instrument => instrument.name == this.index);
    let newDerivative = new Derivative({underlying: underlying, expiry: this.expiry, type: Derivative.name});
    this.apiService.postInstrument(newDerivative)
      .subscribe(
        instrument => this.createDerivativeStatusMessage = instrument.name + " successfully created.",
        error => this.createDerivativeErrorMessage = error
      );
  }

  derivativeOnSelect(event): void {
    let settlementPrice = event.item.prices.filter(price => price.type == 'SETTLEMENT');
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

    let instrument = this.derivatives.find(instrument => instrument.name == this.derivative)[0].id;
    let newPrice = new Price({instrument: instrument, type: PRICE_TYPE.SETTLEMENT, date: this.settlementDate, value: this.settlementValue});
    this.apiService.postPrice(newPrice)
      .subscribe(
        price => this.addSettlementPriceStatusMessage = "Settlement price successfully created.",
        error => this.addSettlementPriceErrorMessage = error
      );
  }

  runJob(): void {
    this.runJobStatusMessage = null;  // Reset status message
    this.runJobErrorMessage = null;  // Reset error message

    this.apiService.runJob(this.job)
      .subscribe(
        result => this.runJobStatusMessage = this.job + " successfully initiated.",
        error => this.runJobErrorMessage = error
      );
  }

  userOnSelect(event): void {
    this.router.navigate(['/users', event.item.id]);
  }
}
