var express = require('express');
var router = express.Router();
var Contract = require('../models/contract');

router.get('/', function(req, res){
  Contract.find({}, function(err, contacts) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(contacts);
    }
  });
});

router.post('/', function(req, res){
  var contract = new Contract({
    underlying: req.body.underlying,
    expiry: req.body.expiry
  });
  contract.save(function(err) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(contract);
    }
  });
});

router.get('/:id', function(req, res){
  Contract.findById(req.params.id, function(err, contract) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (contract) {
      res.json(contract);
    }  else {
      res.status(404).send();  // No contract found
    }
  });
});

module.exports = router
