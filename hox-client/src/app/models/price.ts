import { Instrument } from './instrument';
import { DateOnly } from  'angular-date-only';

export class Price {
  id: string;
  instrument: Instrument;
  type: PRICE_TYPE;
  date: DateOnly;
  value: number;
  updateTimestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.instrument = data.instrument ? Instrument.typeMapper(data.instrument) : null;
      this.type = data.type;
      this.date = data.date ? new DateOnly(data.date) : null;
      this.value = data.value;
      this.updateTimestamp = data.updateTimestamp ? new Date(data.updateTimestamp) : null;
    }
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }

  toJSON() {
    return Object.assign({}, this, {
      instrument: this.instrument.id
    });
  }
}

export enum PRICE_TYPE {
  LAST = "LAST",
  HIGH = "HIGH",
  LOW = "LOW",
  CLOSE = "CLOSE",
  SETTLEMENT = "SETTLEMENT"
}
