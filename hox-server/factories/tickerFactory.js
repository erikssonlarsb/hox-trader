/*
tickerFactory creates tickers from trades.
*/
const Ticker = require('../models/ticker');
const tradeFactory = require('../factories/tradeFactory');

module.exports = {

  // Query tickers.
  query: function(params, {requester, populate = [], sort = {'_id': 'desc'}, limit = null}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    params.side = 'BUY';

    tradeFactory.query(params, {requester: 'admin', populate: populate, sort: sort, limit: limit}, function(err, trades) {
      if(err) {
        callback(err);
      } else {
        const tickers = trades.map(trade => new Ticker(trade));
        callback(err, tickers);
      }
    });
  },

  // Find a single ticker.
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    tradeFactory.findOne(id, queryOptions, function(err, trade) {
      callback(err, trade ? new Ticker(trade) : trade);
    });
  }
}
