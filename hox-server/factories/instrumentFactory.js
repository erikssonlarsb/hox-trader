/*
instrumentFactory handles database interaction for the instruments collection.
*/
const async = require('async');
const Instrument = require('../models/instrument');
const Index = require('../models/instrument.index');
const Derivative = require('../models/instrument.derivative');
const priceFactory = require('./priceFactory');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Query instruments.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Instrument.find(params)
    .populate(populate)
    .exec(function(err, instruments) {
      callback(err, instruments);
    });
  },

  // Find a single instrument
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Instrument.findUnique(id, queryOptions, function(err, instrument) {
      callback(err, instrument);
    });
  },

  // Create an instrument.
  create: function(instrument, callback) {
    Instrument.create(instrument, function(err, instrument) {
      if(err) {
        callback(err);
      } else {
        /*
         * Embedded documents are async-handled in order to return
         * instrument with id's to embedded documents.
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
          /*
           * Return the created instrument including any embedded documents
           */
           callback(err, instrument);
           if(instrument) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Instrument', instrument));
        });
      }
    });
  },

  // Update an instrument
  update: function(id, queryOptions, updateInstrument, callback) {
    if (typeof arguments[2] === 'function') callback = arguments[2];

    Instrument.findUnique(id, queryOptions, function(err, instrument) {
      if(err || !instrument) {
        callback(err, instrument);
      } else {
        if(updateInstrument.status) instrument.status = updateInstrument.status;

        instrument.save(function(err) {
          callback(err, instrument);
          if(!err) eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Instrument', instrument));
        });
      }
    });
  }
}
