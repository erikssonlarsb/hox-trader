import { Price } from './price';
import { DateOnly } from  'angular-date-only';

export class Instrument {
  id: string;
  name: string;
  status: INSTRUMENT_STATUS;
  type: INSTRUMENT_TYPE | string;
  prices: Array<Price>;
  derivatives: Array<Derivative>;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.status = json.status;
    this.type = json.type;
    this.prices = json.prices ? json.prices.map(price => new Price(price)) : null;
    this.derivatives = json.derivatives ? json.derivatives.map(derivative => new Derivative(derivative)) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }

  static typeMapper(instrument): Instrument {
    switch(instrument.type) {
      case INSTRUMENT_TYPE.Index: {
        return new Index(instrument);
      }
      case INSTRUMENT_TYPE.Derivative: {
        return new Derivative(instrument);
      }
      default: {
        return new Instrument(instrument);
      }
    }
  }
}

export enum INSTRUMENT_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum INSTRUMENT_TYPE {
  Index = "Index",
  Derivative = "Derivative"
}

export class Index extends Instrument {
  isin: string;
  ticker: string;

  constructor(json) {
    json.type = INSTRUMENT_TYPE.Index;
    super(json);
    this.isin = json.isin;
    this.ticker = json.ticker;
  }
}

export class Derivative extends Instrument {
  underlying: Instrument;
  expiry: DateOnly;

  constructor(json) {
    json.type = INSTRUMENT_TYPE.Derivative;
    super(json);
    this.underlying = json.underlying ? Instrument.typeMapper(json.underlying) : null;
    this.expiry = json.expiry ? new DateOnly(json.expiry) : null;
  }

  toJSON() {
    return Object.assign({}, this, {
      underlying: this.underlying ? this.underlying.id : null
    });
  }
}
