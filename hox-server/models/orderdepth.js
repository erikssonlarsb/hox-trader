class OrderDepth {
  constructor(instrument) {
    this.instrument = instrument;
    this.levels = [];
    this.totalBuy = 0;
    this.totalSell = 0;
    this.max = 0;
  }

  addOrder(order) {
    let remainingQuantity = order.quantity - order.tradedQuantity;
    let existing = this.levels
      .find((level) => level[order.side.toLowerCase() + 'Price'] == order.price);


    if(existing) {
      existing[order.side.toLowerCase() + 'Quantity'] += remainingQuantity;
      if(order.side == "BUY") {
        this.totalBuy += remainingQuantity;
      } else {
        this.totalSell += remainingQuantity;
      }
      this.max = (this.max > existing[order.side.toLowerCase() + 'Quantity']) ? this.max : existing[order.side.toLowerCase() + 'Quantity'];
    } else {
      let buySide = this.levels.filter(function(level) {
        return level.buyPrice != null;
      }).map(function(level) {
        return {price: level.buyPrice, quantity: level.buyQuantity};
      });
      let sellSide = this.levels.filter(function(level) {
        return level.sellPrice != null;
      }).map(function(level) {
        return {price: level.sellPrice, quantity: level.sellQuantity};
      });

      if(order.side == "BUY") {
        buySide.push({quantity: remainingQuantity, price: order.price});
        buySide.sort(function(levelA, levelB) {return levelB.price - levelA.price});
      } else {
        sellSide.push({quantity: remainingQuantity, price: order.price});
        sellSide.sort(function(levelA, levelB) {return levelA.price - levelB.price});
      }

      var depth = Math.max(buySide.length, sellSide.length);
      var max = 0;
      var totalBuy = 0;
      var totalSell = 0;
      var levels = [];
      for (var i = 0; i < depth; i++) {
        var buyPrice = null;
        var buyQuantity = null;
        var sellPrice = null;
        var sellQuantity = null;
        if (buySide[i]) {
          buyPrice = buySide[i].price;
          buyQuantity = buySide[i].quantity;
          totalBuy += buyQuantity;
          max = (max > buyQuantity) ? max : buyQuantity;
        }
        if (sellSide[i]) {
          sellPrice = sellSide[i].price;
          sellQuantity = sellSide[i].quantity;
          totalSell += sellQuantity;
          max = (max > sellQuantity) ? max : sellQuantity;
        }
        levels.push(new Level(buyPrice, buyQuantity, sellPrice, sellQuantity));
      }
      this.levels = levels;
      this.totalBuy = totalBuy;
      this.totalSell = totalSell;
      this.max = max;
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
