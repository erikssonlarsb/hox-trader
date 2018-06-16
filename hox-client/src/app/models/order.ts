import { Instrument } from './instrument';

export class Order {
  id: string;
  user: string;
  instrument: Instrument;
  side: ORDER_SIDE;
  price: number;
  quantity: number;
  tradedQuantity: number;
  status: ORDER_STATUS;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.user = json.user;
    this.instrument = json.instrument ? Instrument.typeMapper(json.instrument) : null;
    this.side = json.side;
    this.price = json.price;
    this.quantity = json.quantity;
    this.tradedQuantity = json.tradedQuantity;
    this.status= json.status;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }

  toJSON() {
    return Object.assign({}, this, {
      instrument: this.instrument.id
    });
  }
}

export enum ORDER_SIDE {
  BUY = "BUY",
  SELL = "SELL"
}

export enum ORDER_STATUS {
  ACTIVE = "ACTIVE",
  WITHDRAWN = "WITHDRAWN",
  TRADED = "TRADED",
  EXPIRED = "EXPIRED"
}
