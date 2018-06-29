const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const orderDepthFactory = require('../factories/orderDepthFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  orderDepthFactory.query(req.query, req.queryOptions, function(err, orderDepths) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(orderDepths);
    }
  });
});

router.get('/:id', function(req, res) {
  orderDepthFactory.findOne(req.params.id, req.queryOptions, function(err, orderDepth) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (orderDepth) {
      return res.json(orderDepth);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

module.exports = router
