import { User } from './user';
import { Trade } from './trade';

export class Settlement {
  id: string;
  user: User;
  counterpartySettlement: Settlement;
  trades: Array<Trade>;
  isAcknowledged: Boolean;
  amount: number;
  updateTimestamp: Date;

  constructor(data) {
    if(typeof(data) == 'string') {
      this.id = data;
    } else {
      this.id = data._id || data.id;
      this.user = data.user ? new User(data.user) : null;
      this.counterpartySettlement = data.counterpartySettlement ? new Settlement(data.counterpartySettlement) : null;
      this.trades = data.trades ? data.trades.map(trade => new Trade(trade)) : null;
      this.isAcknowledged = data.isAcknowledged;
      this.amount = data.amount;
      this.updateTimestamp = data.updateTimestamp ? new Date(data.updateTimestamp) : null;
    }
  }

  get createTimestamp(): Date {
    return this.id ? new Date(parseInt(this.id.toString().substring(0, 8), 16) * 1000) : null;
  }
}
