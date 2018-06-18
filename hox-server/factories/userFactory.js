/*
userFactory handles database interaction for the users collection.
*/
const User = require('../models/user');
const inviteFactory = require('../factories/inviteFactory');
const systemInfoFactory = require('../factories/systemInfoFactory');

module.exports = {

  // Query users.
  query: function(params, {auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    params[auth.userField] = auth.userId;

    User.find(params)
    .populate(populate)
    .exec(function(err, users) {
      callback(err, users);
    });
  },

  // Find a single user
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    User.findOne({[idField]: id, [auth.userField]: auth.userId})
    .populate(populate)
    .exec(function(err, user) {
      callback(err, user);
    });
  },

  // Create a user.
  create: function(user, callback) {
    systemInfoFactory.findOne({}, function(err, systemInfo) {
      if (err) {
        callback(err);
      } else {
        if (systemInfo.inviteOnly) {
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
                if(user) {
                  user.password = undefined;  // Hide password in response.
                  invite.invitee = user._id;  // Set invitee to prevent invite from being reused.
                  invite.save();
                }
                callback(err, user);
              });
            }
          })
        } else {
          User.create(user, function(err, user) {
            if(user) user.password = undefined;  // Hide password in response.
            callback(err, user);
          });
        }
      }
    });
  },

  // Update a user
  update: function(id, {idField = '_id', auth = {}}, updateUser, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    User.findOne({[idField]:id, [auth.userField]: auth.userId})
    .exec(function(err, user) {
      if(err || !user) {
        callback(err, user);
      } else {
        if(updateUser.name) user.name = updateUser.name;
        if(updateUser.username) user.username = updateUser.username;
        if(updateUser.email) user.email = updateUser.email;
        if(updateUser.phone) user.phone = updateUser.phone;
        if(updateUser.password) user.password = updateUser.password;

        user.save(function(err) {
          if(user) user.password = undefined;  // Hide password in response.
          callback(err, user);
        });
      }
    });
  }
}
