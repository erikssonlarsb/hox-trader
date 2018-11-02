/*
tradeFactory handles database interaction for the trades collection.
*/
const Trade = require('../models/trade');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Query trades.
  query: function(params, {requester, populate = [], sort = null, limit = null}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Trade.find(params)
    .setOptions({requester: requester})
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .exec(function(err, trades) {
      callback(err, trades);
    });
  },

  // Find a single trade.
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Trade.findUnique(id, queryOptions, function(err, trade) {
      callback(err, trade);
    });
  },

  // Create a trade.
  create: function(trade, callback) {
    Trade.create(trade, function(err, trade) {
      callback(err, trade);
      if(trade) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Trade', trade));
    });
  },

  // Update a trade.
  update: function(id, queryOptions, updateTrade, callback) {
    if (typeof arguments[2] === 'function') callback = arguments[2];

    Trade.findUnique(id, queryOptions, function(err, trade) {
      if(err) callback(err);
      else {
        if(updateTrade.isSettled) trade.isSettled = updateTrade.isSettled;

        trade.save(function(err) {
          callback(err, trade);
          if(!err) {
            eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Trade', trade));
          }
        });
      }
    });
  },
}
