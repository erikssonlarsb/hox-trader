import { Instrument } from './instrument';

export class OrderDepth {
  instrument: Instrument;
  levels: Array<Level>;
  totalBuy: number;
  totalSell: number;
  max: number;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.instrument = Instrument.typeMapper(data);
    } else {
      this.instrument = data.instrument ? Instrument.typeMapper(data.instrument) : null;
      this.levels = data.levels ? data.levels.map(level => new Level(level)) : null;
      this.totalBuy = data.totalBuy;
      this.totalSell = data.totalSell;
      this.max = data.max;
    }
  }
}

class Level {
  buyPrice: number;
  buyQuantity: number;
  sellPrice: number;
  sellQuantity: number;

  constructor(data) {
    if(typeof(data) != 'string') {
      this.buyPrice = data.buyPrice;
      this.buyQuantity = data.buyQuantity;
      this.sellPrice = data.sellPrice;
      this.sellQuantity = data.sellQuantity;
    }
  }
}
