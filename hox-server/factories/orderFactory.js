/*
orderFactory handles database interaction for the orders collection.
*/
const Order = require('../models/order');
const Trade = require('../models/trade');
const priceFactory = require('../factories/priceFactory');

module.exports = {

  // Query orders.
  query: function(params, {auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    params[auth.userField] = auth.userId;

    Order.find(params)
    .populate(populate.join(' '))
    .exec(function(err, orders) {
      callback(err, orders);
    });
  },

  // Find a single order.
  findOne: function(id, {idField = '_id', auth = {}, populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Order.findOne({[idField]: id, [auth.userField]: auth.userId})
    .populate(populate.join(' '))
    .exec(function(err, order) {
      callback(err, order);
    });
  },

  // Create an order.
  create: function(order, callback) {
    Order.create(order, function(err, order) {
      callback(err, order);
      matchOrder(order);
    });
  },

  // Update an order.
  update: function(id, {idField = '_id', auth = {}}, updateOrder, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Order.findOne({[idField]: id, [auth.userField]: auth.userId})
    .exec(function(err, order) {
      if(err) callback(err);
      else if(order.status != 'ACTIVE') {
        callback("Cannot modify non-active order.")
      } else {
        if(updateOrder.price) order.price = updateOrder.price;
        if(updateOrder.quantity) order.quantity = updateOrder.quantity;

        order.save(function(err) {
          callback(err, order);
          matchOrder(order);
        });
      }
    });
  },

  // Delete an order. (i.e. set status to WITHDRAW).
  delete: function(id, {idField = '_id', auth = {}}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    Order.findOne({[idField]: id, [auth.userField]: auth.userId})
    .exec(function(err, order) {
      if (err) {
        callback(err);
      } else if(order.status != 'ACTIVE') {
        callback("Cannot delete non-active order.");
      } else {
        order.status = "WITHDRAWN";
        order.save(function(err, order) {
          callback(err, order);
        });
      }
    });
  }
}

function matchOrder(order) {
  let query = {
    instrument: order.instrument,  // Match orders in same instrument
    status: 'ACTIVE'  // Match only active orders
  };
  let sorting = [['updateTimestamp', 'ascending']];  // sort to match oldest order first

  if (order.side == 'BUY') {  // Specific query params for BUY orders
    query.side = 'SELL';  // Match with SELL orders
    query.price = { "$lte": order.price };  // Match with equal or lower price
    sorting.unshift(['price', 'ascending']);  // Match with lowest sell price first (unshift to prioritize over updateTimestamp)
  } else {  // Specific query params for SELL orders
    query.side = 'BUY';  // Match with BUY orders
    query.price = { "$gte": order.price };  // Match with equal or higher price
    sorting.unshift(['price', 'descending']);  // Match with highest buy price first (unshift to prioritize over updateTimestamp)
  }

  Order.find(query).sort(sorting).exec(function (err, matchingOrders) {
    if (err) {
      console.error(err);
    } else {
      for (let matchingOrder of matchingOrders) {
        let matchQuantity = Math.min(
          order.quantity - order.tradedQuantity,  // Remaining quantity on order
          matchingOrder.quantity - matchingOrder.tradedQuantity  // Remaining quantity on matching order
        );

        let trade = new Trade({
          order: order._id,
          user: order.user,
          instrument: order.instrument,
          side: order.side,
          price: matchingOrder.price,
          quantity: matchQuantity
        });

        let matchingTrade = new Trade({
          order: matchingOrder._id,
          user: matchingOrder.user,
          instrument: matchingOrder.instrument,
          side: matchingOrder.side,
          price: matchingOrder.price,
          quantity: matchQuantity
        });

        trade.counterpartyTrade = matchingTrade._id;
        matchingTrade.counterpartyTrade = trade._id;

        order.tradedQuantity += matchQuantity;
        matchingOrder.tradedQuantity += matchQuantity;

        trade.save()
        .then(function() {
          return matchingTrade.save();
        })
        .then(function() {
          return order.save();
        })
        .then(function() {
          return matchingOrder.save();
        })
        .then(function() {
          // Update price for instrument
          let newTradePrice = {
            instrument: order.instrument,
            value: trade.price
          };
          priceFactory.newTradePrice(newTradePrice, function(err) {
            if (err) {
              console.error(err);
            }
          });
        })
        .catch(function(err) {
          console.error(err);
        });

        if(order.quantity == order.tradedQuantity) {
          // order fully traded
          break;
        }
      }
    }
  });
}
