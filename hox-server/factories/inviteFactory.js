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
    .populate(sanitizePopulate(populate))
    .exec(function(err, invites) {
      callback(err, invites);
    });
  },

  // Find a single invite
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Invite.findOne({[idField]: id, [auth.userField]: auth.userId})
    .populate(sanitizePopulate(populate))
    .exec(function(err, invite) {
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

function sanitizePopulate(populate) {
  /*
  Restrict access to the User object referred to in path 'invitee'
   */
  return populate.map(path => {
    if(path.path == 'invitee') {
      return {
        path: 'invitee',
        select: 'name'
      };
    } else {
      return path;
    }
  });
}
