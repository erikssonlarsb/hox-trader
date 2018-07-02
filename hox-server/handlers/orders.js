const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const orderFactory = require('../factories/orderFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  orderFactory.query(req.query, req.queryOptions, function(err, orders) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(orders);
    }
  });
});

router.post('/', function(req, res) {
  req.body.user = req.user._id;  // Hard set user
  orderFactory.create(req.body, function(err, order) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(order);
    }
  });
});

router.get('/:id', function(req, res) {
  orderFactory.findOne(req.params.id, req.queryOptions, function(err, order) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (order) {
      return res.json(order);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

router.put('/:id', function(req, res) {
  orderFactory.update(req.params.id, req.queryOptions, function(err, order) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (order) {
      return res.json(order);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

router.delete('/:id', function(req, res) {
  orderFactory.delete(req.params.id, req.queryOptions, function(err, order) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (order) {
      return res.json(order);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});



module.exports = router
