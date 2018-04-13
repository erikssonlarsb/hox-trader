import { Instrument } from './instrument';

export class Price {
  id: string;
  instrument: Instrument;
  type: PRICE_TYPE;
  date: Date;
  value: number;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.instrument = json.instrument;
    this.type = json.type;
    this.date = json.date ? new Date(json.date) : null;
    this.value = json.value;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}

export enum PRICE_TYPE {
  LAST = "LAST",
  HIGH = "HIGH",
  LOW = "LOW",
  CLOSE = "CLOSE",
  SETTLEMENT = "SETTLEMENT"
}
