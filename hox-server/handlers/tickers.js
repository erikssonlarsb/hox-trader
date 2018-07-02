const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const tickerFactory = require('../factories/tickerFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  tickerFactory.query(req.query, req.queryOptions, function(err, tickers) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(tickers);
    }
  });
});

module.exports = router
