const express = require('express');
const router = express.Router();
const Instrument = require('../models/instrument');
const Index = require('../models/instrument.index');
const Derivative = require('../models/instrument.derivative');
const Price = require('../models/price');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  Instrument.find(req.query)
  .populate('underlying')
  .populate('prices')
  .exec(function(err, instruments) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(instruments);
    }
  });
});

router.post('/', function(req, res) {
  let instrument = null;
  switch(req.body.type) {
    case 'Index':
      instrument = new Index(req.body);
      break;
    case 'Derivative':
      instrument = new Derivative(req.body);
      break;
    default:
      return res.status(500).json(new Error('No such instrument type: ' + req.body.type));
  }
  instrument.save(function(err) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(instrument);
    }
  });
});

router.get('/:id', function(req, res){
  Instrument.findById(req.params.id)
  .populate('underlying')
  .populate('prices')
  .exec(function(err, instrument) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else if (instrument) {
      return res.json(instrument);
    }  else {
      return res.status(404).send();  // No instrument found
    }
  });
});

module.exports = router
