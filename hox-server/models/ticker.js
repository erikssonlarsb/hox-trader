class Ticker {
  constructor(trade) {
    this.instrument = trade.instrument;
    this.price = trade.price;
    this.quantity = trade.quantity;
    this.timestamp = new Date(parseInt(trade.id.substring(0, 8), 16) * 1000);
  }
}

module.exports = Ticker;
