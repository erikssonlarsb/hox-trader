import { Price } from './price';


export class Instrument {
  id: string;
  name: string;
  underlying: string;
  expiry: Date;
  prices: Array<Price>;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.name = json.name;
    this.underlying = json.underlying;
    this.expiry = json.expiry ? new Date(json.expiry) : null;
    this.prices = json.prices ? json.prices.map(price => new Price(price)) : null;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}
