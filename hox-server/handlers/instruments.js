var express = require('express');
var router = express.Router();
var Instrument = require('../models/instrument');

router.get('/', function(req, res){
  Instrument.find(req.query)
  .populate('underlying')
  .exec(function(err, instruments) {
    if (err) {
      res.status(500).json({'error': err.toString()})
    } else {
      res.json(instruments);
    }
  });
});

router.post('/', function(req, res){
  var instrument = new Instrument({
    name: req.body.name,
    type: req.body.type,
    underlying: req.body.underlying,
    expiry: req.body.expiry
  });
  instrument.save(function(err) {
    if (err) {
      res.status(500).json({'error': err.toString()})
    } else {
      res.json(instrument);
    }
  });
});

router.get('/:id', function(req, res){
  Instrument.findById(req.params.id)
  .populate('underlying')
  .exec(function(err, instrument) {
    if (err) {
      res.status(500).json({'error': err.toString()})
    } else if (instrument) {
      res.json(instrument);
    }  else {
      res.status(404).send();  // No instrument found
    }
  });
});

module.exports = router
