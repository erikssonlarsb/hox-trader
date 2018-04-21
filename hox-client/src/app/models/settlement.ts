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

  constructor(json) {
    this.id = json._id;
    this.user = json.user ? new User(json.user) : null;
    this.counterpartySettlement = json.counterpartySettlement ? new Settlement(json.counterpartySettlement) : null;
    this.trades = json.trades ? json.trades.map(trade => new Trade(trade)) : null;
    this.isAcknowledged = json.isAcknowledged;
    this.amount = json.amount;
    this.updateTimestamp = json.updateTimestamp ? new Date(json.updateTimestamp) : null;
  }
}
