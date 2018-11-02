/*
inviteFactory handles database interaction for the invites collection.
*/
const Invite = require('../models/invite');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Query invites.
  query: function(params, {requester, populate = []}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Invite.find(params)
    .setOptions({requester: requester})
    .populate(populate)
    .exec(function(err, invites) {
      callback(err, invites);
    });
  },

  // Find a single invite
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Invite.findUnique(id, queryOptions, function(err, invite) {
      callback(err, invite);
    });
  },

  // Create an invite.
  create: function(invite, callback) {
    Invite.create(invite, function(err, invite) {
      callback(err, invite);
      if(invite) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Invite', invite));
    });
  }
}
