const express = require('express');
const router = express.Router();
const tradeFactory = require('../factories/tradeFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  tradeFactory.query(req.query, req.queryOptions, function(err, trades) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(trades);
    }
  });
});

router.get('/:id', function(req, res) {
  tradeFactory.findOne(req.params.id, req.queryOptions, function(err, trade) {
    if(err) {
      return res.status(500).json(new Error(err));
    } else if (trade) {
      return res.json(trade);
    } else {
      return res.status(404);
    }
  });
});

module.exports = router
