import { Instrument } from './instrument';

export class Price {
  id: string;
  type: PRICE_TYPE;
  date: Date;
  value: Number;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.type = json.type;
    this.date = json.date ? new Date(json.date) : null;
    this.value = json.value;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}

export enum PRICE_TYPE {
  LAST = "LAST",
  CLOSE = "CLOSE",
  SETTLEMENT = "SETTLEMENT"
}
