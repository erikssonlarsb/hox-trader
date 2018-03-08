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
  statusMessage: string;
  errorMessage: string;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    let instrumentParams = new URLSearchParams();
    instrumentParams.append('type', 'INDEX');
    this.apiService.getInstruments(instrumentParams)
    .then((indices) => {
      this.indices = indices;
    })
  }

  createDerivative(): void {
    this.statusMessage = null;  // Reset status message
    this.errorMessage = null;  // Reset error message

    var instrumentId = this.indices.filter(
      instrument => instrument.name == this.index)[0].id;
    this.apiService.postInstrument(null, INSTRUMENT_TYPE.FORWARD, instrumentId, this.expiry)
      .then((instrument) => {
        this.statusMessage = instrument.name + " successfully created."
      })
      .catch((error) => {
        this.errorMessage = error;
      });
  }
}
