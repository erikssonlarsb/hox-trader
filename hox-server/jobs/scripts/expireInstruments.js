var DateOnly = require('dateonly');
var Derivative = require('../../models/instrument.derivative');
var Order = require('../../models/order');

exports.run = function() {
  console.log("### expireInstruments started.");
  Derivative.find({status: 'ACTIVE', expiry: {$lte: new DateOnly()}})
  .exec(function (err, instruments) {
    if(err) {
      console.log("Error finding derivatives to inactivate: %s.", err);
    } else if(instruments) {
      for (let instrument of instruments) {
        instrument.status = 'INACTIVE';
        instrument.save();
        console.log("Expired instrument: " + instrument._id);
        Order.find({status: 'ACTIVE', instrument: instrument._id})
        .exec(function(err, orders) {
          if(err) {
            console.log("Error finding order to expire: %s.", err);
          } else if(orders) {
            for (let order of orders) {
              order.status = 'EXPIRED';
              order.save();
              console.log("Expired order: " + order._id);
            }
          }
        })
      }
    }
  });
};
