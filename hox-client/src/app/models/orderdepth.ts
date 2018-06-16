import { Instrument } from './instrument';

export class OrderDepth {
  instrument: Instrument;
  levels: Array<Level>;
  totalBuy: number;
  totalSell: number;
  max: number;

  constructor(json) {
    this.instrument = json.instrument ? Instrument.typeMapper(json.instrument) : null;
    this.levels = json.levels ? json.levels.map(level => new Level(level)) : null;
    this.totalBuy = json.totalBuy;
    this.totalSell = json.totalSell;
    this.max = json.max;
  }
}

class Level {
  buyPrice: number;
  buyQuantity: number;
  sellPrice: number;
  sellQuantity: number;

  constructor(json) {
    this.buyPrice = json.buyPrice;
    this.buyQuantity = json.buyQuantity;
    this.sellPrice = json.sellPrice;
    this.sellQuantity = json.sellQuantity;
  }
}
