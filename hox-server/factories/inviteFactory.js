/*
inviteFactory handles database interaction for the invites collection.
*/
const Invite = require('../models/invite');

module.exports = {

  // Query invites.
  query: function(params, {auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    params[auth.userField] = auth.userId;

    Invite.find(params)
    .populate(Invite.sanitizePopulate(populate))
    .exec(function(err, invites) {
      callback(err, invites);
    });
  },

  // Find a single invite
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Invite.findUnique({[idField]: id, [auth.userField]: auth.userId}, Invite.sanitizePopulate(populate), function(err, invite) {
      callback(err, invite);
    });
  },

  // Create an invite.
  create: function(invite, callback) {
    Invite.create(invite, function(err, invite) {
      callback(err, invite);
    });
  }
}
