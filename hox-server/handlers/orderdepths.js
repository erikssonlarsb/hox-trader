var express = require('express');
var router = express.Router();
var Derivative = require('../models/instrument.derivative');
var Order = require('../models/order');
var OrderDepth = require('../models/orderdepth');

router.get('/', function(req, res) {
  var orderDepths = {};

  req.query.expiry = {$gt: Date.now()};
  Derivative.find(req.query)
    .then(instruments => {
      instruments.forEach(function(instrument) {
        orderDepths[instrument._id] = new OrderDepth(instrument);
      });
      return Order.find({status: 'ACTIVE', instrument: {$in: instruments.map((instrument) => instrument._id)}});
    })
    .then(orders => {
      orders.forEach(function(order) {
        orderDepths[order.instrument].addOrder(order);
      });
      res.json(Object.keys(orderDepths).map(function(key) { return orderDepths[key]; })); // Convert map to array
    })
    .catch(err => {
      res.status(500).json({ error : err });
    });
});

router.get('/:id', function(req, res) {
  var orderDepth;
  Derivative.findById(req.params.id)
  .then(instrument => {
    orderDepth = new OrderDepth(instrument);
    return Order.find({instrument: instrument._id, status: 'ACTIVE'});
  })
  .then(orders => {
    orders.forEach(function(order) {
      orderDepth.addOrder(order);
    });
    res.json(orderDepth);
  })
  .catch(err => {
    res.status(500).json({ error : err });
  });
});

module.exports = router
