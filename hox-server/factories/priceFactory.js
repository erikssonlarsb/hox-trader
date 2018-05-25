const async = require('async');
const Price = require('../models/price');
const Error = require('../utils/error');

module.exports = {
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Price.find(params)
    .populate(populate.join(' '))
    .exec(function(err, prices) {
      callback(err, prices);
    });
  },

  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Price.findOne({[idField]:id})
    .populate(populate.join(' '))
    .exec(function(err, price) {
      callback(err, price);
    });
  },

  create: function(price, callback) {
    Price.create(price, function(err, price) {
      callback(err, price);
    });
  }
}
