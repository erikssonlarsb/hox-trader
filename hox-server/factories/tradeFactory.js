/*
tradeFactory handles database interaction for the trades collection.
*/
const Trade = require('../models/trade');

module.exports = {

  // Query trades.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    let tradeQuery = Trade.find(params);

    tradeQuery = populateQuery(tradeQuery, populate);

    tradeQuery.exec(function(err, trades) {
      callback(err, trades);
    });
  },

  // Find a single trade.
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    let tradeQuery = Trade.findOne({[idField]:id});

    tradeQuery = populateQuery(tradeQuery, populate);

    tradeQuery.exec(function(err, trade) {
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

function populateQuery(query, populate) {
  /* Function for dynamic population of query.
   * Argument populate contains array of strings which are added to
   * the query. Certain populates are altered, in order to either add
   * sub references, or to protect data on private (user) documents.
   */

  query.populate(populate.join(' '));

  if(populate.includes('counterpartyTrade')) {
    // Restrict access to information on counterparty trade
    query.populate({
      path: 'counterpartyTrade',
      select: 'user',
      populate: {path: 'user', select: 'name email phone'}
    });
  }

  return query;
}
