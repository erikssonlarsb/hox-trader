var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Settlement = require('../models/settlement');
var Error = require('../utils/error');

router.get('/', function(req, res){
  Settlement.find(req.query)
  .populate('user')
  .populate('trades')
  .populate({
    path: 'counterpartySettlement',
    select: 'user isAcknowledged',
    populate: {path: 'user', select: 'name email phone'}
  })
  .exec(function(err, settlements) {
    if (err) {
      res.status(500).json(new Error(err));
    } else {
      res.json(settlements);
    }
  });
});

router.get('/:id', function(req, res){
  req.query._id = req.params.id;
  Settlement.findOne(req.query)
  .populate('user')
  .populate({
    path: 'trades',
    populate: {
      path: 'instrument',
      populate: {
        path: 'prices',
        match: { type: { $eq: 'SETTLEMENT'}}
      }
    }
  })
  .populate({
    path: 'counterpartySettlement',
    select: 'user isAcknowledged',
    populate: {path: 'user', select: 'name email phone'}
  })
  .exec(function(err, trade) {
    if (err) {
      res.status(500).json(new Error(err));
    } else if (trade) {
      res.json(trade);
    } else {
      res.status(404).send();  // No order found
    }
  });
});


router.put('/:id', function(req, res){
  modifySettlement(req, function(err, settlement) {
    if (err) {
      res.status(500).json(new Error(err));
    } else {
      res.json(settlement);
    }
  });
});

function modifySettlement(req, callback) {
  req.query._id = req.params.id;
  Settlement.findOne(req.query)
  .exec(function(err, settlement) {
    if (err) {
      callback(err, null);
    } else if (settlement) {
      settlement.isAcknowledged = req.body.isAcknowledged;

      settlement.save(function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, settlement);
        }
      });
    } else {
      callback("Settlement not found", null);
    }
  });
}


module.exports = router
