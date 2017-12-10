var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Contract = require('../models/contract');

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
  Contract.findById(req.body.contract, function(err, contract) {
    if (contract) {
      createOrder(contract, req, function(err, order) {
        if (err) {
          res.status(500).json({'error': err})
        } else {
          res.json(order);
        }
      });
    } else {
      Contract.findOne({name: req.body.contract}, function(err, contract) {
        if (contract) {
          createOrder(contract, req, function(err, order) {
            if (err) {
              res.status(500).json({'error': err})
            } else {
              res.json(order);
            }
          });
        } else {
          res.status(500).json({'error': 'Invalid contract.'});
        }
      });
    }
  });
});

function createOrder(contract, req, callback) {
  var order = new Order({
    user: req.auth.user._id,
    contract: contract._id,
    side: req.body.side,
    price: req.body.price,
    quantity: req.body.quantity
  });
  order.save(function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, order);
    }
  });
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
