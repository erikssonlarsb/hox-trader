import { Instrument } from './instrument';

export class OrderDepth {
  instrument: Instrument;
  buy: Array<Level>;
  sell: Array<Level>;

  constructor(json) {
    this.instrument = new Instrument(json.instrument);
    this.buy = json.buy.map(level => new Level(level));
    this.sell = json.sell.map(level => new Level(level));
  }
}

class Level {
  price: number;
  quantity: number;

  constructor(json) {
    this.price = json.price;
    this.quantity = json.quantity;
  }
}
