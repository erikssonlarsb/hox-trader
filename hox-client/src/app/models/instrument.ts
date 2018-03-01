import { Price } from './price';


export class Instrument {
  id: string;
  name: string;
  type: string;
  underlying: Instrument;
  expiry: Date;
  prices: Array<Price>;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.name = json.name;
    this.type = json.type;
    this.underlying = json.underlying ? new Instrument(json.underlying) : null;
    this.expiry = json.expiry ? new Date(json.expiry) : null;
    this.prices = json.prices ? json.prices.map(price => new Price(price)) : null;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}
