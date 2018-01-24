class OrderDepth {
  constructor(instrument) {
    this.instrument = instrument;
    this.buy = [];
    this.sell = [];
  }

  addOrder(order) {
    var existing = this[order.side.toLowerCase()].find((level) => level.price == order.price);
    if(existing) {
      existing.quantity += order.quantity;
    } else {
      this[order.side.toLowerCase()].push({quantity: order.quantity, price: order.price});
    }

    // Sort levels. Buy has highest on top. Sell has lowest on top.
    this.buy.sort(function(a, b) {return b.price - a.price});
    this.sell.sort(function(a, b) {return a.price - b.price});
  }
}

module.exports = OrderDepth;
