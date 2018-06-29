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

    Settlement.find(params)
    .populate(sanitizePopulate(populate))
    .exec(function(err, settlement) {
      callback(err, settlement);
    });
  },

  // Find a single settlement.
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Settlement.findUnique({[idField]: id, [auth.userField]: auth.userId}, sanitizePopulate(populate), function(err, settlement) {
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
  update: function(id, {idField = '_id', auth = {}, populate = []}, updateSettlement, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Settlement.findUnique({[idField]: id, [auth.userField]: auth.userId}, sanitizePopulate(populate), function(err, settlement) {
      if(err) callback(err);
      if(updateSettlement.isAcknowledged) settlement.isAcknowledged = updateSettlement.isAcknowledged;

      settlement.save(function(err) {
        callback(err, settlement);
      });
    });
  }
}

function sanitizePopulate(populate) {
  /*
  Restrict access to the Settlement object referred to in path 'counterpartySettlement'
   */
  return populate.map(path => {
    if(path.path == 'counterpartySettlement') {
      return {
        path: 'counterpartySettlement',
        select: 'user isAcknowledged',
        populate: {path: 'user', select: 'name email phone'}
      };
    } else {
      return path;
    }
  });
}
