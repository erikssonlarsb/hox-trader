import { Instrument } from './instrument';
import { User } from './user';
import { ORDER_SIDE } from './order';
import { Trade } from './trade';

export class Position {
  instrument: Instrument;
  user: User;
  side: ORDER_SIDE;
  trades: Array<Trade> = [];

  constructor(data) {
    if(typeof(data) == 'string') {
      this.instrument = Instrument.typeMapper(data);
    } else {
      this.instrument = data.instrument ? Instrument.typeMapper(data.instrument) : null;
      this.user = data.user ? new User(data.user) : null;
      this.trades = data.trades ? data.trades.map(trade => new Trade(trade)) : null;
    }
  }

  get isSettled(): boolean {
    return this.trades ? this.trades[0].isSettled : null;
  }

  get buyTrades(): Array<Trade> {
    return this.trades.filter((trade) => trade.side == ORDER_SIDE.BUY);
  }

  get sellTrades(): Array<Trade> {
    return this.trades.filter((trade) => trade.side == ORDER_SIDE.SELL);
  }

  get openQuantity(): number {
    let buyQuantity = this.buyTrades.reduce((sum, trade) => {return sum + trade.quantity}, 0);
    let sellQuantity = this.sellTrades.reduce((sum, trade) => {return sum + trade.quantity}, 0);

    return buyQuantity - sellQuantity;
  }

  get closedQuantity(): number {
    let buyQuantity = this.buyTrades.reduce((sum, trade) => {return sum + trade.quantity}, 0);
    let sellQuantity = this.sellTrades.reduce((sum, trade) => {return sum + trade.quantity}, 0);

    return Math.min(buyQuantity, sellQuantity);
  }

  get averageBuyPrice(): number {
    let buyValue = this.buyTrades.reduce((sum, trade) => sum + trade.price * trade.quantity, 0);
    let buyQuantity = this.buyTrades.reduce((sum, trade) => {return sum + trade.quantity}, 0);

    return buyValue / buyQuantity;
  }

  get averageSellPrice(): number {
    let sellValue = this.sellTrades.reduce((sum, trade) => sum + trade.price * trade.quantity, 0);
    let sellQuantity = this.sellTrades.reduce((sum, trade) => {return sum + trade.quantity}, 0);

    return sellValue / sellQuantity;
  }

  get realizedProfitLoss(): number {
    return this.closedQuantity * (this.averageSellPrice - this.averageBuyPrice) || 0;
  }

  get exposure(): number {
    let quantity = this.openQuantity;
    if (quantity > 0) {
      return quantity * this.averageBuyPrice;
    } else {
      // Worst case for short position is team wins, i.e. sells
      return Math.abs(quantity) * (30 - this.averageSellPrice);  // Subtract from 30 since it's the highest price a
    }
  }

  addTrade(trade: Trade): void {
    this.trades.push(trade);
  }
}
