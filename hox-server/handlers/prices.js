const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const priceFactory = require('../factories/priceFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  priceFactory.query(req.query, req.queryOptions, function(err, prices) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(prices);
    }
  });
});

router.post('/', function(req, res) {
  priceFactory.create(req.body, function(err, price) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(price);
    }
  });
});

router.get('/:id', function(req, res) {
  priceFactory.findOne(req.params.id, req.queryOptions, function(err, price) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (price) {
      return res.json(price);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

module.exports = router
