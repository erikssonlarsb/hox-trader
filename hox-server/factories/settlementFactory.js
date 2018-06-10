/*
settlementFactory handles database interaction for the settlements collection.
*/
const Settlement = require('../models/settlement');

module.exports = {

  // Query settlements.
  query: function(params, {auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    params[auth.userField] = auth.userId;

    let settlementQuery = Settlement.find(params);

    settlementQuery = populateQuery(settlementQuery, populate);

    settlementQuery.exec(function(err, settlement) {
      callback(err, settlement);
    });
  },

  // Find a single settlement.
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    let settlementQuery = Settlement.findOne({[idField]: id, [auth.userField]: auth.userId});

    settlementQuery = populateQuery(settlementQuery, populate);

    settlementQuery.exec(function(err, settlement) {
      callback(err, settlement);
    });
  },

  // Create a settlement.
  create: function(settlement, callback) {
    Settlement.create(settlement, function(err, settlement) {
      callback(err, settlement);
    });
  },

  // Update a settlement
  update: function(id, {idField = '_id', auth = {}}, updateSettlement, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Settlement.findOne({[idField]:id, [auth.userField]: auth.userId})
    .exec(function(err, settlement) {
      if(err) callback(err);
      if(updateSettlement.isAcknowledged) settlement.isAcknowledged = updateSettlement.isAcknowledged;

      settlement.save(function(err) {
        callback(err, settlement);
      });
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

  if(populate.includes('trades')) {
    // Add additional data required for settlement details in client.
    query.populate({
      path: 'trades',
      populate: {
        path: 'instrument',
        populate: {
          path: 'prices',
          match: { type: { $eq: 'SETTLEMENT'}}
        }
      }
    })
  }

  if(populate.includes('counterpartySettlement')) {
    // Restrict access to information on counterparty settlement.
    query.populate({
      path: 'counterpartySettlement',
      select: 'user isAcknowledged',
      populate: {path: 'user', select: 'name email phone'}
    });
  }

  return query;
}
