import { Injectable, PipeTransform, Pipe } from '@angular/core';

import { Instrument, INSTRUMENT_STATUS } from '../models/index';

@Pipe({name: 'instrument'})
@Injectable()
export class InstrumentPipe implements PipeTransform  {
  transform(instruments: Array<Instrument>, status: INSTRUMENT_STATUS): Array<Instrument> {
    if(!instruments) {
      return null;
    } else if (!status) {
      return instruments;
    } else {
      return instruments.filter(
        instrument => instrument.status == status
      );
    }
  }
}
