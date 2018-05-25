import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams }  from '@angular/common/http';

import { DateOnly } from 'angular-date-only';

import { ApiService } from '../../services/api/api.service';

import { INSTRUMENT_TYPE, INSTRUMENT_STATUS, Instrument, Index, Derivative, Price, PRICE_TYPE, User } from '../../models/index';

import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'app-order',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  implements OnInit  {

  underlyings: Array<Index>;
  derivatives: Array<Derivative>;

  instrumentTypes: any = INSTRUMENT_TYPE;
  instrumentType: string;
  instrumentName: string;
  instrumentIsin: string;
  instrumentTicker: string;
  minDate: string = new DateOnly().toISOString();  // Prevent expiry < Today
  underlying: Index;
  underlyingVal: string;  // required for ngModel binding
  expiryDate: string;  // string required for input type date
  createInstrumentStatusMessage: string;
  createInstrumentErrorMessage: string;


  priceTypes: any = PRICE_TYPE;
  priceType: string;
  instrument: Instrument;
  instrumentVal: string;  // required for ngModel binding
  priceDate: string;  // string required for input type date
  priceValue: number;
  addPriceStatusMessage: string;
  addPriceErrorMessage: string;

  jobs: Array<string>;
  job: string;
  runJobStatusMessage: string;
  runJobErrorMessage: string;

  users: Array<User>;
  user: User;

  constructor(private router: Router, private apiService: ApiService, private pricePipe : PricePipe) { }

  ngOnInit(): void {
    this.apiService.getInstruments(new HttpParams().set('type', 'Index'))
      .subscribe(
        instruments => this.underlyings = <Index[]> instruments
      );

    let derivativeParams = new HttpParams({
      fromObject: {
        'type': 'Derivative',
        '_populate': 'prices'
      }
    });
    this.apiService.getInstruments(derivativeParams)
      .subscribe(
        instruments => this.derivatives = <Derivative[]> instruments.filter(
          instrument => this.pricePipe.transform(instrument.prices, 'SETTLEMENT') == null
        )
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

  createInstrument(): void {
    this.createInstrumentStatusMessage = null;  // Reset status message
    this.createInstrumentErrorMessage = null;  // Reset error message

    let newInstrument: Instrument;
    if(this.instrumentType == 'Derivative') {
      newInstrument = new Derivative({status: INSTRUMENT_STATUS.ACTIVE, underlying: this.underlying, expiry: this.expiryDate});
    } else if(this.instrumentType == 'Index') {
      newInstrument = new Index({status: INSTRUMENT_STATUS.INACTIVE, name: this.instrumentName, isin: this.instrumentIsin, ticker: this.instrumentTicker});
    }
    this.apiService.postInstrument(newInstrument)
      .subscribe(
        instrument => this.createInstrumentStatusMessage = instrument.name + " successfully created.",
        error => this.createInstrumentErrorMessage = error.message
      );
  }

  addPrice(): void {
    this.addPriceStatusMessage = null;  // Reset status message
    this.addPriceErrorMessage = null;  // Reset error message

    let newPrice = new Price({instrument: this.instrument, type: this.priceType, date: this.priceDate, value: this.priceValue});
    this.apiService.postPrice(newPrice)
      .subscribe(
        price => this.addPriceStatusMessage = "Price successfully created.",
        error => this.addPriceErrorMessage = error.message
      );
  }

  runJob(): void {
    this.runJobStatusMessage = null;  // Reset status message
    this.runJobErrorMessage = null;  // Reset error message

    this.apiService.runJob(this.job)
      .subscribe(
        result => this.runJobStatusMessage = this.job + " successfully initiated.",
        error => this.runJobErrorMessage = error.message
      );
  }

  userOnSelect(event): void {
    this.router.navigate(['/users', event.item.id]);
  }
}
