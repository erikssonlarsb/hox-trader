const async = require('async');
const instrumentFactory = require('../factories/instrumentFactory');

class Ticker {
  constructor(trade) {
    this.instrument = trade.instrument;
    this.price = trade.price;
    this.quantity = trade.quantity;
    this.timestamp = new Date(parseInt(trade.id.substring(0, 8), 16) * 1000);
  }

  populate(populate, callback) {
    let ticker = this;
    async.each(populate, function(path, callback) {
      if(path.path == 'instrument') {
        instrumentFactory.findOne(ticker.instrument, {populate: path.populate}, function(err, instrument) {
          if(err) {
            callback(err);
          } else {
            ticker.instrument = instrument;
            callback();
          }
        });
      } else {
        callback();
      }
    }, function(err) {
      callback(err, ticker);
    });
  }
}

module.exports = Ticker;
