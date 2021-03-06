/*
orderFactory handles database interaction for the orders collection.
*/
const Order = require('../models/order');
const Trade = require('../models/trade');
const priceFactory = require('../factories/priceFactory');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Query orders.
  query: function(params, {requester, populate = []}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Order.find(params)
    .setOptions({requester: requester})
    .populate(populate)
    .exec(function(err, orders) {
      callback(err, orders);
    });
  },

  // Find a single order.
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Order.findUnique(id, queryOptions, function(err, order) {
      callback(err, order);
    });
  },

  // Create an order.
  create: function(order, callback) {
    Order.create(order, function(err, order) {
      callback(err, order);
      if(order) {
        eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Order', order));
        matchOrder(order);
      }
    });
  },

  // Update an order.
  update: function(id, queryOptions, updateOrder, callback) {
    if (typeof arguments[2] === 'function') callback = arguments[2];

    Order.findUnique(id, queryOptions, function(err, order) {
      if(err) callback(err);
      else if(order.status != 'ACTIVE') {
        callback("Cannot modify non-active order.")
      } else {
        if(updateOrder.price) order.price = updateOrder.price;
        if(updateOrder.quantity) order.quantity = updateOrder.quantity;

        order.save(function(err) {
          callback(err, order);
          if(!err) {
            eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Order', order));
            matchOrder(order);
          }
        });
      }
    });
  },

  // Delete an order. (i.e. set status to WITHDRAW).
  delete: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    Order.findUnique(id, queryOptions, function(err, order) {
      if (err) {
        callback(err);
      } else if(order.status != 'ACTIVE') {
        callback("Cannot delete non-active order.");
      } else {
        order.status = "WITHDRAWN";
        order.save(function(err) {
          callback(err, order);
          if(!err) eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Order', order));
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
  let sorting = [['_id', 'ascending']];  // sort to match oldest order first

  if (order.side == 'BUY') {  // Specific query params for BUY orders
    query.side = 'SELL';  // Match with SELL orders
    query.price = { "$lte": order.price };  // Match with equal or lower price
    sorting.unshift(['price', 'ascending']);  // Match with lowest sell price first (unshift to prioritize over updateTimestamp)
  } else {  // Specific query params for SELL orders
    query.side = 'BUY';  // Match with BUY orders
    query.price = { "$gte": order.price };  // Match with equal or higher price
    sorting.unshift(['price', 'descending']);  // Match with highest buy price first (unshift to prioritize over updateTimestamp)
  }

  Order.find(query)
  .setOptions({requester: 'admin'})
  .sort(sorting)
  .exec(function (err, matchingOrders) {
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
          // Emit Create Trade events
          eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Trade', trade));
          eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Trade', matchingTrade));

          // Emit Update Order events
          eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Order', order));
          eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Order', matchingOrder));

          // Update price for instrument
          let newTradePrice = {
            instrument: order.instrument,
            value: trade.price
          };
          priceFactory.newTradePrice(newTradePrice, function(err) {
            if(err) console.error(err);
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
