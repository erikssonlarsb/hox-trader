var express = require('express');
var router = express.Router();
var Trade = require('../models/trade');
var Error = require('../utils/error');

router.get('/', function(req, res){
  Trade.find(req.query)
  .populate('order')
  .populate('user')
  .populate('instrument')
  .populate({
    path: 'counterpartyTrade',
    select: 'user',
    populate: {path: 'user', select: 'name email phone'}
  })
  .exec(function(err, trades) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(trades);
    }
  });
});

router.get('/:id', function(req, res){
  req.query._id = req.params.id;
  Trade.findOne(req.query)
  .populate('order')
  .populate('user')
  .populate('instrument')
  .populate({
    path: 'counterpartyTrade',
    select: 'user',
    populate: {path: 'user', select: 'name email phone'}
  })
  .exec(function(err, trade) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else if (trade) {
      return res.json(trade);
    } else {
      return res.status(404).send();  // No order found
    }
  });
});

module.exports = router
