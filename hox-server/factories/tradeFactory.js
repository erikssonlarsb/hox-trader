/*
tradeFactory handles database interaction for the trades collection.
*/
const Trade = require('../models/trade');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Query trades.
  query: function(params, {auth = {}, populate = [], sort = null, limit = null}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    params[auth.userField] = auth.userId;

    Trade.find(params)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .exec(function(err, trades) {
      callback(err, trades);
    });
  },

  // Find a single trade.
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Trade.findUnique({[idField]: id, [auth.userField]: auth.userId}, Trade.sanitizePopulate(populate), function(err, trade) {
      callback(err, trade);
    });
  },

  // Create a trade.
  create: function(trade, callback) {
    Trade.create(trade, function(err, trade) {
      callback(err, trade);
      if(trade) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Trade', trade));
    });
  }
}
