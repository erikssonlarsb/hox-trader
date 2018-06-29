const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const settlementFactory = require('../factories/settlementFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  settlementFactory.query(req.query, req.queryOptions, function(err, settlements) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(settlements);
    }
  });
});

router.post('/', function(req, res) {
  settlementFactory.create(req.body, function(err, settlement) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(settlement);
    }
  });
});

router.get('/:id', function(req, res) {
  settlementFactory.findOne(req.params.id, req.queryOptions, function(err, settlement) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (settlement) {
      return res.json(settlement);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

router.put('/:id', function(req, res) {
  settlementFactory.update(req.params.id, req.queryOptions, req.body, function(err, settlement) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (settlement) {
      return res.json(settlement);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

module.exports = router
