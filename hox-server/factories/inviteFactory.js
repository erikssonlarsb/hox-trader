/*
inviteFactory handles database interaction for the invites collection.
*/
const Invite = require('../models/invite');

module.exports = {

  // Query invites.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    let inviteQuery = Invite.find(params);

    inviteQuery = populateQuery(inviteQuery, populate);

    inviteQuery.exec(function(err, invites) {
      callback(err, invites);
    });
  },

  // Find a single invite
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Invite.findOne({[idField]:id})
    .populate(populate.join(' '))
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

function populateQuery(query, populate) {
  /* Function for dynamic population of query.
   * Argument populate contains array of strings which are added to
   * the query. Certain populates are altered, in order to either add
   * sub references, or to protect data on private (user) documents.
   */

  query.populate(populate.join(' '));

  if(populate.includes('invitee')) {
    // Restrict access to information on invitee
    query.populate({
      path: 'invitee',
      select: 'name'
    });
  }

  return query;
}
