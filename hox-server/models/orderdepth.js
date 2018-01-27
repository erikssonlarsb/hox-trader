class OrderDepth {
  constructor(instrument) {
    this.instrument = instrument;
    this.levels = [];
  }

  addOrder(order) {
    var existing = this.levels
      .find((level) => level[order.side.toLowerCase() + 'Price'] == order.price);

    if(existing) {
      existing[order.side.toLowerCase() + 'Quantity'] += order.quantity;
    } else {
      var buySide = this.levels.filter(function(level) {
        return level.buyPrice != null;
      }).map(function(level) {
        return {price: level.buyPrice, quantity: level.buyQuantity};
      });
      var sellSide = this.levels.filter(function(level) {
        return level.sellPrice != null;
      }).map(function(level) {
        return {price: level.sellPrice, quantity: level.sellQuantity};
      });

      if(order.side == "BUY") {
        buySide.push({quantity: order.quantity, price: order.price});
        buySide.sort(function(levelA, levelB) {return levelB.price - levelA.price});
      } else {
        sellSide.push({quantity: order.quantity, price: order.price});
        sellSide.sort(function(levelA, levelB) {return levelA.price - levelB.price});
      }
      var max = Math.max(buySide.length, sellSide.length);
      var levels = [];
      for (var i = 0; i < max; i++) {
        var buyPrice = null;
        var buyQuantity = null;
        var sellPrice = null;
        var sellQuantity = null;
        if (buySide[i]) {
          buyPrice = buySide[i].price;
          buyQuantity = buySide[i].quantity;
        }
        if (sellSide[i]) {
          sellPrice = sellSide[i].price;
          sellQuantity = sellSide[i].quantity;
        }
        levels.push(new Level(buyPrice, buyQuantity, sellPrice, sellQuantity));
      }
      this.levels = levels;
    }
  }
}

class Level {
  constructor(buyPrice, buyQuantity, sellPrice, sellQuantity) {
    this.buyPrice = buyPrice;
    this.buyQuantity = buyQuantity;
    this.sellPrice = sellPrice;
    this.sellQuantity = sellQuantity;
  }
}

module.exports = OrderDepth;
