import { User } from './user';
import { Instrument } from './instrument';

export class Order {
  id: string;
  user: User;
  instrument: Instrument;
  side: ORDER_SIDE;
  price: number;
  quantity: number;
  tradedQuantity: number;
  status: ORDER_STATUS;
  updateTimestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.user = data.user ? new User(data.user) : null;
      this.instrument = data.instrument ? Instrument.typeMapper(data.instrument) : null;
      this.side = data.side;
      this.price = data.price;
      this.quantity = data.quantity;
      this.tradedQuantity = data.tradedQuantity;
      this.status= data.status;
      this.updateTimestamp = data.updateTimestamp ? new Date(data.updateTimestamp) : null;
    }
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
