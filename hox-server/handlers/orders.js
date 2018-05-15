var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Order = require('../models/order');
var Trade = require('../models/trade');
var Instrument = require('../models/instrument');
var Price = require('../models/price');
var Error = require('../utils/error');

router.get('/', function(req, res) {
  Order.find(req.query)
  .populate('user')
  .populate('instrument')
  .exec(function(err, orders) {
    if (err) {
      res.status(500).json(new Error(err));
    } else {
      res.json(orders);
    }
  });
});

router.get('/:id', function(req, res) {
  req.query._id = req.params.id;
  Order.findOne(req.query)
  .populate('user')
  .populate('instrument')
  .exec(function(err, order) {
    if (err) {
      res.status(500).json(new Error(err));
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
            res.status(500).json(new Error(err));
          } else {
            res.json(order);
          }
        });
      } else {
        res.status(500).json(new Error("No such instrument."));
      }
    });
  } else {
    createOrder(req, function(err, order) {
      if (err) {
        res.status(500).json(new Error(err));
      } else {
        res.json(order);
      }
    });
  }
});

router.put('/:id', function(req, res){
  modifyOrder(req, function(err, order) {
    if (err) {
      res.status(500).json(new Error(err));
    } else {
      res.json(order);
    }
  });
});

router.delete('/:id', function(req, res){
  deleteOrder(req, function(err, order) {
    if (err) {
      res.status(500).json(new Error(err));
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
  req.query._id = req.params.id;
  Order.findOne(req.query)
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
  req.query._id = req.params.id;
  Order.findOne(req.query)
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

  var sorting = [['updateTimestamp', 1]];

  if (order.side == 'BUY') {
    query.side = 'SELL';
    query.price = { "$lte": order.price };
    sorting.unshift(['price', 1]);
  } else {
    query.side = 'BUY';
    query.price = { "$gte": order.price };
    sorting.unshift(['price', -1]);
  }

  Order.find(query).sort(sorting).exec(function (err, matchingOrders) {
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
          instrument: order.instrument,
          side: order.side,
          price: matchingOrder.price,
          quantity: matchQuantity
        });

        var matchingTrade = new Trade({
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
          return Price.findOne(
            {
              instrument: order.instrument,
              type: "LAST"
            }, function (err, existingPrice) {
            if (err) {
              console.log(err);
            } else if (existingPrice) {
              existingPrice.value = matchingOrder.price;
              existingPrice.date = new Date();
              existingPrice.save();
            } else {
              var price = new Price({
                instrument: order.instrument,
                type: "LAST",
                date: new Date(),
                value: matchingOrder.price
              });
              price.save();
            }
          })
        })
        .then(function() {
          return Price.findOne(
            {
              instrument: order.instrument,
              type: "HIGH"
            }, function (err, existingPrice) {
            if (err) {
              console.log(err);
            } else if (existingPrice) {
              if (matchingOrder.price > existingPrice.value) {
                existingPrice.value = matchingOrder.price;
                existingPrice.date = new Date();
                existingPrice.save();
              }
            } else {
              var price = new Price({
                instrument: order.instrument,
                type: "HIGH",
                date: new Date(),
                value: matchingOrder.price
              });
              price.save();
            }
          })
        })
        .then(function() {
          return Price.findOne(
            {
              instrument: order.instrument,
              type: "LOW"
            }, function (err, existingPrice) {
            if (err) {
              console.log(err);
            } else if (existingPrice) {
              if (matchingOrder.price < existingPrice.value) {
                existingPrice.value = matchingOrder.price;
                existingPrice.date = new Date();
                existingPrice.save();
              }
            } else {
              var price = new Price({
                instrument: order.instrument,
                type: "LOW",
                date: new Date(),
                value: matchingOrder.price
              });
              price.save();
            }
          })
        })
        .catch(function(error) {
          console.log(error);
        });

        if(order.quantity == order.tradedQuantity) {
          // order fully traded
          break;
        }
      }
    }
  })
}

module.exports = router
