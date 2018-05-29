/*
userFactory handles database interaction for the users collection.
*/
const User = require('../models/user');

module.exports = {

  // Query users.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    User.find(params)
    .populate(populate.join(' '))
    .exec(function(err, prices) {
      callback(err, prices);
    });
  },

  // Find a single user
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    User.findOne({[idField]:id})
    .populate(populate.join(' '))
    .exec(function(err, user) {
      callback(err, user);
    });
  },

  // Create a user.
  create: function(user, callback) {
    User.create(user, function(err, user) {
      if(user) user.password = undefined;  // Hide password in response.
      callback(err, user);
    });
  },

  // Update a user
  update: function(id, {idField = '_id', populate = []}, updateUser, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    User.findOne({[idField]:id}, function(err, user) {
      if(err) callback(err);
      if(updateUser.name) user.name = updateUser.name;
      if(updateUser.username) user.username = updateUser.username;
      if(updateUser.email) user.email = updateUser.email;
      if(updateUser.phone) user.phone = updateUser.phone;
      if(updateUser.password) user.password = updateUser.password;

      user.save(function(err) {
        if(user) user.password = undefined;  // Hide password in response.
        callback(err, user);
      });
    });
  }
}
