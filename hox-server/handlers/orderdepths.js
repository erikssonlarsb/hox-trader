var express = require('express');
var router = express.Router();
var Instrument = require('../models/instrument');
var Order = require('../models/order');
var OrderDepth = require('../models/orderdepth');
var Error = require('../utils/error');

router.get('/', function(req, res) {
  var orderDepths = {};

  Instrument.find(req.query)
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
      return res.json(Object.keys(orderDepths).map(function(key) { return orderDepths[key]; })); // Convert map to array
    })
    .catch(err => {
      return res.status(500).json(new Error(err));
    });
});

router.get('/:id', function(req, res) {
  var orderDepth;
  Instrument.findById(req.params.id)
  .then(instrument => {
    orderDepth = new OrderDepth(instrument);
    return Order.find({instrument: instrument._id, status: 'ACTIVE'});
  })
  .then(orders => {
    orders.forEach(function(order) {
      orderDepth.addOrder(order);
    });
    return res.json(orderDepth);
  })
  .catch(err => {
    return res.status(500).json(new Error(err));
  });
});

module.exports = router
