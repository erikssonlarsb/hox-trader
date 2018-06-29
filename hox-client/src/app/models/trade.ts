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
  updateTimestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.order = data.order ? new Order(data.order) : null;
      this.user = data.user ? new User(data.user) : null;
      this.counterpartyTrade = data.counterpartyTrade ? new Trade(data.counterpartyTrade) : null;
      this.instrument = data.instrument ? Instrument.typeMapper(data.instrument) : null;
      this.side = data.side;
      this.price = data.price;
      this.quantity = data.quantity;
      this.isSettled = data.isSettled;
      this.updateTimestamp = data.updateTimestamp ? new Date(data.updateTimestamp) : null;
    }
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }
}
