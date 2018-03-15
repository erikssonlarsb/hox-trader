import { Component, OnInit } from '@angular/core';
import { URLSearchParams }  from '@angular/http';

import { ApiService } from '../../services/api/api.service';

import { Instrument, INSTRUMENT_TYPE } from '../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent  implements OnInit  {
  indices: Array<Instrument>;
  minDate: Date = new Date();
  expiry: Date;
  index: string;
  createDerivativeStatusMessage: string;
  createDerivativeErrorMessage: string;

  jobs: Array<string>;
  job: string;
  runJobStatusMessage: string;
  runJobSErrorMessage: string;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    let instrumentParams = new URLSearchParams();
    instrumentParams.append('type', 'INDEX');
    this.apiService.getInstruments(instrumentParams)
    .then((indices) => {
      this.indices = indices;
    });

    this.apiService.getJobs()
    .then((jobs) => {
      this.jobs = jobs;
    });
  }

  createDerivative(): void {
    this.createDerivativeStatusMessage = null;  // Reset status message
    this.createDerivativeErrorMessage = null;  // Reset error message

    var instrumentId = this.indices.filter(
      instrument => instrument.name == this.index)[0].id;
    this.apiService.postInstrument(null, INSTRUMENT_TYPE.FORWARD, instrumentId, this.expiry)
      .then((instrument) => {
        this.createDerivativeStatusMessage = instrument.name + " successfully created."
      })
      .catch((error) => {
        this.createDerivativeErrorMessage = error;
      });
  }

  runJob(): void {
    this.runJobStatusMessage = null;  // Reset status message
    this.runJobSErrorMessage = null;  // Reset error message

    this.apiService.runJob(this.job)
      .then((info) => {
        this.runJobStatusMessage = this.job + " successfully initiated."
      })
      .catch((error) => {
        this.runJobSErrorMessage = error;
      });
  }
}
