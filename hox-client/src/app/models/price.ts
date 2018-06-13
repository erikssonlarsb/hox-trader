import { Instrument } from './instrument';
import { DateOnly } from  'angular-date-only';

export class Price {
  id: string;
  instrument: Instrument;
  type: PRICE_TYPE;
  date: DateOnly;
  value: number;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.instrument = json.instrument;
    this.type = json.type;
    this.date = json.date ? new DateOnly(json.date) : null;
    this.value = json.value;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
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
