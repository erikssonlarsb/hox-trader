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
  }
}

module.exports = OrderDepth;
