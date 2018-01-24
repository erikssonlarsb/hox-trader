var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var OrderDepth = require('../models/orderdepth');

router.get('/', function(req, res){
  var query = {status: "ACTIVE"};
  Order.find(query)
  .populate('instrument')
  .exec(function(err, orders) {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      var orderdepths = {};
      orders.forEach(function(order) {
        if(!orderdepths[order.instrument._id]) {
          orderdepths[order.instrument._id] = new OrderDepth(order.instrument);
        }
        orderdepths[order.instrument._id].addOrder(order);
      });
      res.json(orderdepths);
    }
  });
});

module.exports = router
