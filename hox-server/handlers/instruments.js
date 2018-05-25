const express = require('express');
const router = express.Router();
const async = require('async');
const instrumentFactory = require('../factories/instrumentFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  instrumentFactory.query(req.query, req.queryOptions, function(err, instruments) {
    if(err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(instruments);
    }
  });
});

router.post('/', function(req, res) {
  instrumentFactory.create(req.body, function(err, instrument) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(instrument);
    }
  });
});

router.get('/:id', function(req, res) {
  instrumentFactory.findOne(req.params.id, req.queryOptions, function(err, instrument) {
    if(err) {
      return res.status(500).json(new Error(err));
    } else if (instrument) {
      return res.json(instrument);
    } else {
      return res.status(404);
    }
  });
});

module.exports = router;
