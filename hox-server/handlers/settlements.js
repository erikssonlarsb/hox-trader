var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Settlement = require('../models/settlement');

router.get('/', function(req, res){
  if (!req.auth.user.role.isAdmin) {
    req.query.user = req.auth.user._id;
  }
  Settlement.find(query)
  .populate('user')
  .populate('trades')
  .populate({
    path: 'counterpartySettlement',
    select: 'user isAcknowledged',
    populate: {path: 'user', select: 'name email phone'}
  })
  .exec(function(err, settlements) {
    if (err) {
      res.status(500).json({'error': err.toString()});
    } else {
      res.json(settlements);
    }
  });
});

router.get('/:id', function(req, res){
  var query = {_id: req.params.id};
  if (!req.auth.user.role.isAdmin) {
    query.user = req.auth.user._id;
  }
  Settlement.findOne(query)
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
      res.status(500).json({'error': err.toString()})
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
      res.status(500).json({'error': err.toString()});
    } else {
      res.json(settlement);
    }
  });
});

function modifySettlement(req, callback) {
  var query = {_id: req.params.id};
  if (!req.auth.user.role.isAdmin) {
    query.user = req.auth.user._id;
  }
  Settlement.findOne(query)
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
