var express = require('express');
var router = express.Router();
var Price = require('../models/price');

router.get('/', function(req, res){
  Price.find(req.query, function(err, prices) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(prices);
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
      res.status(500).json({'error': err})
    } else {
      res.json(price);
    }
  });
});

module.exports = router
