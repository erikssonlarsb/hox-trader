import { Price } from './price';
import { DateOnly } from  'angular-date-only';

export class Instrument {
  id: string;
  name: string;
  status: INSTRUMENT_STATUS;
  type: INSTRUMENT_TYPE;
  prices: Array<Price>;
  derivatives: Array<Derivative>;
  updateTimestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.name = data.name;
      this.status = data.status;
      this.type = data.type;
      this.prices = data.prices ? data.prices.map(price => new Price(price)) : null;
      this.derivatives = data.derivatives ? data.derivatives.map(derivative => new Derivative(derivative)) : null;
      this.updateTimestamp = data.updateTimestamp ? new Date(data.updateTimestamp) : null;
    }
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

  constructor(data) {
    super(data);
    this.type = INSTRUMENT_TYPE.Index;
    if(typeof(data) != 'string') {
      this.isin = data.isin;
      this.ticker = data.ticker;
    }
  }
}

export class Derivative extends Instrument {
  underlying: Instrument;
  expiry: DateOnly;

  constructor(data) {
    super(data);
    this.type = INSTRUMENT_TYPE.Derivative;
    if(typeof(data) != 'string') {
      this.underlying = data.underlying ? Instrument.typeMapper(data.underlying) : null;
      this.expiry = data.expiry ? new DateOnly(data.expiry) : null;
    }
  }

  toJSON() {
    return Object.assign({}, this, {
      underlying: this.underlying ? this.underlying.id : null
    });
  }
}
