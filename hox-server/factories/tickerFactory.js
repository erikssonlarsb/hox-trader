/*
tickerFactory creates tickers from trades.
*/
const Ticker = require('../models/ticker');
const tradeFactory = require('../factories/tradeFactory');

module.exports = {

  // Query orderDepths.
  query: function(params, {populate = [], sort = {'_id': 'desc'}, limit = null}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    params.side = 'BUY';

    tradeFactory.query(params, {populate: populate, sort: sort, limit: limit}, function(err, trades) {
      if(err) {
        callback(err);
      } else {
        const tickers = trades.map(trade => new Ticker(trade));
        callback(err, tickers);
      }
    });
  }
}