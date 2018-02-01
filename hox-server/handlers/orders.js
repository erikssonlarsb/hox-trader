var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Order = require('../models/order');
var Trade = require('../models/trade');
var Instrument = require('../models/instrument');

router.get('/', function(req, res){
  var query = {};
  if (!req.auth.user.role.isAdmin) {
    query.user = req.auth.user._id;
  }
  Order.find(query)
  .populate('user')
  .populate('instrument')
  .exec(function(err, orders) {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      res.json(orders);
    }
  });
});

router.get('/:id', function(req, res){
  var query = {_id: req.params.id};
  if (!req.auth.user.role.isAdmin) {
    query.user = req.auth.user._id;
  }
  Order.findOne(query)
  .populate('user')
  .populate('instrument')
  .exec(function(err, order) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (order) {
      res.json(order);
    } else {
      res.status(404).send();  // No order found
    }
  });
});

router.post('/', function(req, res){
  if (!mongoose.Types.ObjectId.isValid(req.body.instrument)) {
    Instrument.findOne({name: req.body.instrument}, function(err, instrument) {
      if (instrument) {
        req.body.instrument = instrument._id;
        createOrder(req, function(err, order) {
          if (err) {
            res.status(500).json({'error': err});
          } else {
            res.json(order);
          }
        });
      } else {
        res.status(500).json({'error': "Instrument not found."});
      }
    });
  } else {
    createOrder(req, function(err, order) {
      if (err) {
        res.status(500).json({'error': err});
      } else {
        res.json(order);
      }
    });
  }
});

router.put('/:id', function(req, res){
  modifyOrder(req, function(err, order) {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      res.json(order);
    }
  });
});

router.delete('/:id', function(req, res){
  deleteOrder(req, function(err, order) {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      res.status(204).end();
    }
  });
});

function createOrder(req, callback) {
  var order = new Order({
    user: req.auth.user._id,
    instrument: req.body.instrument,
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
  })
  .then(function() {
    matchOrder(order);
  });
}

function modifyOrder(req, callback) {
  var query = {_id: req.params.id};
  if (!req.auth.user.role.isAdmin) {
    query.user = req.auth.user._id;
  }
  Order.findOne(query)
  .populate('user')
  .populate('instrument')
  .exec(function(err, order) {
    if (err) {
      callback(err, null);
    } else if (order) {
      order.quantity = req.body.quantity;
      order.price = req.body.price;

      order.save(function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, order);
        }
      }).then(function() {
        matchOrder(order);
      });
    } else {
      callback("Order not found", null);
    }
  });
}

function deleteOrder(req, callback) {
  var query = {_id: req.params.id};
  if (!req.auth.user.role.isAdmin) {
    query.user = req.auth.user._id;
  }
  Order.findOne(query)
  .exec(function(err, order) {
    if (err) {
      callback(err, null);
    } else if (order) {
      if(order.status == 'ACTIVE') {
        order.status = 'WITHDRAWN'
      } else {
        callback("Order not active", null);
      }
      order.save(function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, order);
        }
      });
    } else {
      callback("Order not found", null);
    }
  });
}

function matchOrder(order) {
  var query = {
    instrument: order.instrument,
    status: 'ACTIVE',
  }

  if (order.side == 'BUY') {
    query.side = 'SELL';
    query.price = { "$lte": order.price };
  } else {
    query.side = 'BUY';
    query.price = { "$gte": order.price };
  }

  Order.find(query).sort('modifyTimestamp').exec(function (err, matchingOrders) {
    if(err) {
      console.log("Error finding order to match: %s.", err);
    } else {
      for (let matchingOrder of matchingOrders) {
        var matchQuantity = Math.min(
          order.quantity - order.tradedQuantity,
          matchingOrder.quantity - matchingOrder.tradedQuantity
        );
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

        if(order.quantity == order.tradedQuantity) {
          // order fully traded
          break;
        }
      }
    }
  })
}

module.exports = router
