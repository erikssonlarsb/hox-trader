/*
instrumentFactory handles database interaction for the instruments collection.
*/

const async = require('async');
const Instrument = require('../models/instrument');
const Index = require('../models/instrument.index');
const Derivative = require('../models/instrument.derivative');
const priceFactory = require('./priceFactory');
const Error = require('../utils/error');


module.exports = {

  // Query instruments.
  query: function(params, {populate = []}, callback) {
    //  If options is omitted, re-align reference to callback function.
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Instrument.find(params)
    .populate(populate.join(' '))  // Populate any fields in the populate option.
    .exec(function(err, instruments) {
      callback(err, instruments);
    });
  },

  // Find a single instrument
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    //  If options is omitted, re-align reference to callback function.
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Instrument.findOne({[idField]:id})
    .populate(populate.join(' ')) // Populate any fields in the populate option.
    .exec(function(err, instrument) {
      callback(err, instrument);
    });
  },

  // Create an instrument.
  create: function(instrument, callback) {
    if(!instrument) {
      callback("No instrument");
    } else {
      Instrument.create(instrument, function(err, instrument) {
        if(err) {
          callback(err);
        } else {
          /*
            Embedded documents are async-handled in order to return
            instrument with id's to embedded documents.
          */
          async.parallel([
            function(callback) {
              // Process (any) emedded prices
              if(instrument.prices) {
                // Copy and erase prices. Will be re-inserted after DB-save.
                let prices = instrument.prices;
                instrument.prices = [];
                async.each(prices, function(price, callback) {
                  price.instrument = instrument.id;  // Add reference to instrument.
                  priceFactory.create(price, function(err, price) {
                    if(err) {
                      callback(err);
                    } else {
                      instrument.prices.push(price);  // Add DB-saved price.
                      callback();
                    }
                  });
                }, function(err) {
                  callback(err);
                });
              } else {
                callback();
              }
            },
            function(callback) {
              // Process (any) embedded derivatives.
              if(instrument.derivatives) {
                // Copy and erase derivatives. Will be re-inserted after DB-save.
                let derivatives = instrument.derivatives;
                instrument.derivatives = [];
                async.each(derivatives, function(derivative, callback) {
                  derivative.underlying = instrument.id;  // Add reference to instrument.
                  module.exports.create(derivative, function(err, derivative) {
                    if(err) {
                      callback(err);
                    } else {
                      instrument.derivatives.push(derivative);  // Add DB-saved derivative.
                      callback();
                    }
                  })
                }, function(err) {
                  callback(err)
                });
              } else {
                callback();
              }
            }
          ],
          function(err) {
            callback(err, instrument);
          });
        }
      });
    }
  }
}
