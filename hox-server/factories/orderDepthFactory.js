/*
orderDepthFactory handles arrgregation of active orders into ordere depths
*/
const OrderDepth = require('../models/orderdepth');
const instrumentFactory = require('../factories/instrumentFactory');
const orderFactory = require('../factories/orderFactory');

module.exports = {

  // Query orderDepths.
  query: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    instrumentFactory.query(params, {populate: populate}, function(err, instruments) {
      if(err) {
        callback(err);
      } else {
        /* Create an object of OrderDepths for each instrument.
           The key is later used to map orders to each the OrderDepth */
        let orderDepths = instruments.reduce(function(result, instrument) {
          result[instrument._id] = new OrderDepth(instrument);
          return result;
        }, {});
        orderFactory.query({instrument: Object.keys(orderDepths), status: "ACTIVE"}, function(err, orders) {
          if(err) {
            callback(err);
          } else {
            for (let order of orders) {
              orderDepths[order.instrument].addOrder(order);
            }
            callback(err, Object.values(orderDepths));
          }
        });
      }
    });
  },

  // Find a single orderDepth.
  findOne: function(id, {idField = '_id', populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    instrumentFactory.findOne(id, {idField: idField, populate: populate}, function(err, instrument) {
      if(err) {
        callback(err);
      } else if (!instrument) {
        return callback(err, instrument);
      } else {
        let orderDepth = new OrderDepth(instrument);
        orderFactory.query({instrument: instrument._id, status: "ACTIVE"}, function(err, orders) {
          if(err) {
            callback(err);
          } else {
            for (let order of orders) {
              orderDepth.addOrder(order);
            }
            callback(err, orderDepth);
          }
        });
      }
    });
  }
}
