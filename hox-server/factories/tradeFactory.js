/*
tradeFactory handles database interaction for the trades collection.
*/
const Trade = require('../models/trade');

module.exports = {

  // Query trades.
  query: function(params, {auth = {}, populate = [], sort = null, limit = null}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    params[auth.userField] = auth.userId;

    Trade.find(params)
    .populate(sanitizePopulate(populate))
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

    Trade.findUnique({[idField]: id, [auth.userField]: auth.userId}, sanitizePopulate(populate), function(err, trade) {
      callback(err, trade);
    });
  },

  // Create a trade.
  create: function(trade, callback) {
    Trade.create(trade, function(err, trade) {
      callback(err, trade);
    });
  }
}

function sanitizePopulate(populate) {
  /*
  Restrict access to the Trade object referred to in path 'counterpartyTrade'
   */
  return populate.map(path => {
    if(path.path == 'counterpartyTrade') {
      return {
        path: 'counterpartyTrade',
        select: 'user',
        populate: {path: 'user', select: 'name email phone'}
      };
    } else {
      return path;
    }
  });
}
