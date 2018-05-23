var express = require('express');
var router = express.Router();
var Price = require('../models/price');
var Error = require('../utils/error');

router.get('/', function(req, res){
  Price.find(req.query, function(err, prices) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(prices);
    }
  });
});

router.post('/', function(req, res){
  var price = new Price({
    instrument: req.body.instrument,
    type: req.body.type,
    date: req.body.date,
    value: req.body.value
  });
  price.save(function(err) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(price);
    }
  });
});

module.exports = router
