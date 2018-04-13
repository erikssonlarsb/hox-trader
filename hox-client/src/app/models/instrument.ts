import { Price } from './price';

export class Instrument {
  id: string;
  name: string;
  type: INSTRUMENT_TYPE | string;
  prices: Array<Price>;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.type = json.type;
    this.prices = json.prices ? json.prices.map(price => new Price(price)) : null;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}

export enum INSTRUMENT_TYPE {
  Index = "Index",
  Derivative = "Derivative"
}

export class Index extends Instrument {
  isin: string;
  ticker: string;

  constructor(json) {
    super(json);
    this.isin = json.isin;
    this.ticker = json.ticker;
  }
}

export class Derivative extends Instrument {
  underlying: Instrument;
  expiry: Date;

  constructor(json) {
    super(json);
    this.underlying = json.underlying ? new Instrument(json.underlying) : null;
    this.expiry = json.expiry ? new Date(json.expiry) : null;
  }

  toJSON() {
    return Object.assign({}, this, {
      underlying: this.underlying.id
    });
  }
}
