var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Trade = require('../models/trade');
var Instrument = require('../models/instrument');

router.get('/', function(req, res){
  Order.find({}, function(err, orders) {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      res.json(orders);
    }
  });
});

router.post('/', function(req, res){
  Instrument.findById(req.body.instrument, function(err, instrument) {
    if (instrument) {
      createOrder(instrument, req, function(err, order) {
        if (err) {
          res.status(500).json({'error': err})
        } else {
          res.json(order);
        }
      });
    } else {
      Instrument.findOne({name: req.body.instrument}, function(err, instrument) {
        if (instrument) {
          createOrder(instrument, req, function(err, order) {
            if (err) {
              res.status(500).json({'error': err})
            } else {
              res.json(order);
            }
          });
        } else {
          res.status(500).json({'error': 'Invalid instrument.'});
        }
      });
    }
  });
});

function createOrder(instrument, req, callback) {
  var order = new Order({
    user: req.auth.user._id,
    instrument: instrument._id,
    side: req.body.side,
    price: req.body.price,
    quantity: req.body.quantity,
    status: req.body.status
  });
  order.save(function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, order);
    }
  }).then(function() {
    //  Match new order to existing to generate trades
    var otherSide = order.side == 'BUY' ? 'SELL' : 'BUY';
    Order.find({
      instrument: order.instrument,
      side: otherSide,
      status: 'ACTIVE'
    }).sort('updateTimestamp').exec(function (err, matchingOrders) {
      if(err) {
        console.log("Error finding order to match: %s.", err);
      } else {
        matchingOrders.some(function(matchingOrder) {
          if ((order.side == 'BUY' && order.price >= matchingOrder.price) ||
              (order.side == 'SELL' && order.price <= matchingOrder.price)) {
            //  Orders match, create trades
            var matchQuantity = Math.min(order.quantity, matchingOrder.quantity);

            var trade = new Trade({
              order: order._id,
              user: order.user,
              counterparty: matchingOrder.user,
              instrument: order.instrument,
              side: order.side,
              price: matchingOrder.price,
              quantity: matchQuantity
            });

            var matchingTrade = new Trade({
              order: matchingOrder._id,
              user: matchingOrder.user,
              counterparty: order.user,
              instrument: matchingOrder.instrument,
              side: matchingOrder.side,
              price: matchingOrder.price,
              quantity: matchQuantity
            });

            matchingTrade.save(function(err) {
              if (err) {
                throw Error(err);
              } else {
                matchingOrder.tradedQuantity += matchQuantity;
                matchingOrder.save(function(err) {
                  if (err) {
                    throw Error(err);
                  }
                });
              }
            }).then(
              trade.save(function(err) {
                if (err) {
                  throw Error(err);
                } else {
                  order.tradedQuantity += matchQuantity;
                  order.save(function(err) {
                    if (err) {
                      throw Error(err);
                    }
                    return order.quantity == 0;  // If filly filled, break loop
                  });
                };
              })
            );
          }
        });
      }
    });
  })
};

router.get('/:id', function(req, res){
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (order) {
      res.json(order);
    } else {
      res.status(404).send();  // No order found
    }
  });
});

module.exports = router
