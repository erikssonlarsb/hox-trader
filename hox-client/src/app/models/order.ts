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
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.user = json.user;
    this.instrument = new Instrument(json.instrument);
    this.side = json.side;
    this.price = json.price;
    this.quantity = json.quantity;
    this.tradedQuantity = json.tradedQuantity;
    this.status= json.status;
    this.createTimestamp = new Date(json.createTimestamp);
    this.updateTimestamp = new Date(json.updateTimestamp);
  }
}

export enum ORDER_SIDE {
  BUY = "BUY",
  SELL = "SELL"
}

export enum ORDER_STATUS {
  ACTIVE = "ACTIVE",
  WITHDRAWN = "WITHDRAWN",
  TRADED = "TRADED"
}
