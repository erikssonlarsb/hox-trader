/*
roleFactory handles database interaction for the roles collection.
*/
const Role = require('../models/role');

module.exports = {

  // Query roles.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Role.find(params)
    .populate(populate)
    .exec(function(err, roles) {
      callback(err, roles);
    });
  },

  // Find a single role
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Role.findUnique({[idField]:id}, populate, function(err, role) {
      callback(err, role);
    });
  },

  // Create a price.
  create: function(role, callback) {
    Role.create(role, function(err, role) {
      callback(err, role);
    });
  }
}
