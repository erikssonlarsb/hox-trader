import { Order, ORDER_SIDE } from './order';
import { Instrument } from './instrument';

export class Trade {
  id: string;
  order: Order;
  user: string;
  counterparty: string;
  instrument: Instrument;
  side: ORDER_SIDE;
  price: number;
  quantity: number;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.order = new Order(json.order);
    this.user = json.user;
    this.counterparty = json.counterparty;
    this.instrument = new Instrument(json.instrument);
    this.side = json.side;
    this.price = json.price;
    this.quantity = json.quantity;
    this.createTimestamp = new Date(json.createTimestamp);
    this.updateTimestamp = new Date(json.updateTimestamp);
  }
}
