var express = require('express');
var router = express.Router();
var Trade = require('../models/trade');

router.get('/', function(req, res){
  Trade.find({})
  .populate('order')
  .populate('user')
  .populate('counterparty', 'name email phone')
  .populate('instrument')
  .exec(function(err, trades) {
    if (err) {
      res.status(500).json({'error': err});
    } else {
      res.json(trades);
    }
  });
});

router.get('/:id', function(req, res){
  Trade.findById(req.params.id)
  .populate('order')
  .populate('user')
  .populate('counterparty', 'name email phone')
  .populate('instrument')
  .exec(function(err, trade) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (trade) {
      res.json(trade);
    } else {
      res.status(404).send();  // No order found
    }
  });
});

module.exports = router
