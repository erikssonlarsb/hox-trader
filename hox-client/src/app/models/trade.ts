import { Order, ORDER_SIDE } from './order';
import { User } from './user';
import { Instrument } from './instrument';

export class Trade {
  id: string;
  order: Order;
  user: User;
  counterpartyTrade: Trade;
  instrument: Instrument;
  side: ORDER_SIDE;
  price: number;
  quantity: number;
  isSettled: boolean;
  createTimestamp: Date;
  updateTimestamp: Date;

  constructor(json) {
    this.id = json._id;
    this.order = json.order ? new Order(json.order) : null;
    this.user = json.user ? new User(json.user) : null;
    this.counterpartyTrade = json.counterpartyTrade ? new Trade(json.counterpartyTrade) : null;
    this.instrument = json.instrument ? new Instrument(json.instrument) : null;
    this.side = json.side;
    this.price = json.price;
    this.quantity = json.quantity;
    this.isSettled = json.isSettled;
    this.createTimestamp = json.createTimestamp ? new Date(json.createTimestamp) : null;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}
