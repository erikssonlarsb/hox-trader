const DateOnly = require('dateonly');
const Derivative = require('../../models/instrument.derivative');
const Order = require('../../models/order');
const eventEmitter = require('../../events/eventEmitter');
const DocumentEvent = require('../../events/event.document');

exports.run = function() {
  console.log("### expireInstruments started.");
  Derivative.find({status: 'ACTIVE', expiry: {$lte: new DateOnly()}})
  .exec(function (err, instruments) {
    if(err) {
      console.log("Error finding derivatives to inactivate: %s.", err);
    } else if(instruments) {
      for (let instrument of instruments) {
        instrument.status = 'INACTIVE';
        instrument.save(function(err) {
          if(err) {
            console.error(err);
          } else {
            eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Instrument', instrument));
            console.log("Expired instrument: " + instrument.name);
          }
        });
        Order.find({status: 'ACTIVE', instrument: instrument._id})
        .exec(function(err, orders) {
          if(err) {
            console.log("Error finding order to expire: %s.", err);
          } else if(orders) {
            for (let order of orders) {
              order.status = 'EXPIRED';
              order.save(function(err) {
                if(err) {
                  console.error(err);
                } else {
                  eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Order', order));
                  console.log("Expired order: " + order._id);
                }
              });
            }
          }
        });
      }
    }
  });
};
