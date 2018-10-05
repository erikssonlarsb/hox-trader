/*
userFactory handles database interaction for the users collection.
*/
const User = require('../models/user');
const inviteFactory = require('../factories/inviteFactory');
const systemInfoFactory = require('../factories/systemInfoFactory');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');
const Error = require('../utils/error');

module.exports = {

  // Query users.
  query: function(params, {requester, populate = []}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    User.find(params)
    .setOptions({requester: requester})
    .populate(populate)
    .exec(function(err, users) {
      callback(err, users);
    });
  },

  // Find a single user
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    User.findUnique(id, queryOptions, function(err, invite) {
      callback(err, invite);
    });
  },

  // Create a user.
  create: function(user, callback) {
    systemInfoFactory.query({}, function(err, systemInfos) {
      if (err) {
        callback(err);
      } else {
        if (systemInfos.length < 1) {
          callback(new Error("SystemInfo not available. Cannot create user."))
        }
        else if (systemInfos[0].inviteOnly) {
          inviteFactory.findOne(user.invite, {idField: 'code'}, function(err, invite) {
            if (err) {
              callback(err);
            } else if (!invite) {
              callback("Invalid invite.");
            } else if(invite.invitee) {
              callback("Invite has already been used.");
            } else {
              user.invite = undefined;
              User.create(user, function(err, user) {
                if(err) {
                  callback(err);
                } else {
                  user.password = undefined;  // Hide password in response.
                  callback(err, user);
                  eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'User', user));

                  // Update the invite (with the invited user) to prevent it from being reused.
                  invite.invitee = user._id;
                  invite.save(function(err) {
                    if(!err) eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Invite', invite));
                  });
                }
              });
            }
          })
        } else {
          User.create(user, function(err, user) {
            if(err) {
              callback(err);
            } else {
              user.password = undefined;  // Hide password in response.
              callback(err, user);
              eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'User', user));
            }
          });
        }
      }
    });
  },

  // Update a user
  update: function(id, {idField = '_id', auth = {}, populate = []}, updateUser, callback) {
    if (typeof arguments[2] === 'function') callback = arguments[2];

    User.findUnique({[idField]: id, [auth.userField]: auth.userId}, populate, function(err, user) {
      if(err || !user) {
        callback(err, user);
      } else {
        if(updateUser.name) user.name = updateUser.name;
        if(updateUser.username) user.username = updateUser.username;
        if(updateUser.email) user.email = updateUser.email;
        if(updateUser.phone) user.phone = updateUser.phone;
        if(updateUser.password) user.password = updateUser.password;

        user.save(function(err) {
          if(err) {
            callback(err);
          } else {
            user.password = undefined;  // Hide password in response.
            callback(err, user);
            eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'User', user));
          }
        });
      }
    });
  }
}
