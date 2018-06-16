import { Instrument } from './instrument';

export class Ticker {
  instrument: Instrument;
  price: number;
  quantity: number;
  timestamp: Date;

  constructor(json) {
    this.instrument = json.instrument ? new Instrument(json.instrument) : null;
    this.price = json.price;
    this.quantity = json.quantity;
    this.timestamp = json.timestamp ? new Date(json.timestamp) : null;
  }
}
