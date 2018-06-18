/*
priceFactory handles database interaction for the prices collection.
*/
const Price = require('../models/price');

module.exports = {

  // Query prices.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Price.find(params)
    .populate(populate)
    .exec(function(err, prices) {
      callback(err, prices);
    });
  },

  // Find a single price
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Price.findOne({[idField]:id})
    .populate(populate)
    .exec(function(err, price) {
      callback(err, price);
    });
  },

  // Create a price.
  create: function(price, callback) {
    Price.create(price, function(err, price) {
      callback(err, price);
    });
  },

  // Upsert LAST, HIGH, LOW for instrument when a new trade occurs.
  newTradePrice(newTradePrice, callback) {
    Price.find({instrument: newTradePrice.instrument, type: ["LAST", "HIGH", "LOW"]}, function(err, prices) {
      if (err) {
        callback(err);
      } else if (prices.length == 0) {
        // No existing prices. Create new LAST, HIGH, LOW.
        newTradePrice.date = new Date();
        newTradePrice.type = "LAST";
        Price.create(newTradePrice, function(err, price) {
          if(err) {
            callback(err);
          }
        });
        newTradePrice.type = "HIGH";
        Price.create(newTradePrice, function(err, price) {
          if(err) {
            callback(err);
          }
        });
        newTradePrice.type = "LOW";
        Price.create(newTradePrice, function(err, price) {
          if(err) {
            callback(err);
          }
        });
      } else {
        // Update existing LAST, HIGH, LOW
        for(let price of prices) {
          if (price.type == "LAST") {
            price.date = new Date();
            price.value = newTradePrice.value;
            price.save();
          } else if (price.type == "HIGH") {
            if (newTradePrice.value > price.value) {
              price.date = new Date();
              price.value = newTradePrice.value;
              price.save();
            }
          } else if (price.type == "LOW") {
            if (newTradePrice.value < price.value) {
              price.date = new Date();
              price.value = newTradePrice.value;
              price.save();
            }
          }
        }
      }
      callback(null);
    })
  }
}
