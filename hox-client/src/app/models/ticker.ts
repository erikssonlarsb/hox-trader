import { Instrument } from './instrument';

export class Ticker {
  instrument: Instrument;
  price: number;
  quantity: number;
  timestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.instrument = Instrument.typeMapper(data);
    } else {
      this.instrument = data.instrument ? Instrument.typeMapper(data.instrument) : null;
      this.price = data.price;
      this.quantity = data.quantity;
      this.timestamp = data.timestamp ? new Date(data.timestamp) : null;
    }
  }
}
