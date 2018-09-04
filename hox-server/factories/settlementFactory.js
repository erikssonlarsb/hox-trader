/*
settlementFactory handles database interaction for the settlements collection.
*/
const Settlement = require('../models/settlement');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Query settlements.
  query: function(params, {requester, populate = ''}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Settlement.find(params)
    .setOptions({requester: requester})
    .populate(populate)
    .exec(function(err, settlement) {
      callback(err, settlement);
    });
  },

  // Find a single settlement.
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Settlement.findUnique(id, queryOptions, function(err, settlement) {
      callback(err, settlement);
    });
  },

  // Create a settlement.
  create: function(settlement, callback) {
    Settlement.create(settlement, function(err, settlement) {
      callback(err, settlement);
      if(settlement) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Settlement', settlement));
    });
  },

  // Update a settlement
  update: function(id, queryOptions, updateSettlement, callback) {
    if (typeof arguments[2] === 'function') callback = arguments[2];

    Settlement.findUnique(id, queryOptions, function(err, settlement) {
      if(err) callback(err);
      if(updateSettlement.isAcknowledged) settlement.isAcknowledged = updateSettlement.isAcknowledged;

      settlement.save(function(err) {
        callback(err, settlement);
        if(!err) eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Settlement', settlement));
      });
    });
  }
}
