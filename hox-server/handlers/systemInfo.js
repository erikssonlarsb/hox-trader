const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const systemInfoFactory = require('../factories/systemInfoFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  systemInfoFactory.query(req.query, req.queryOptions, function(err, systemInfos) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(systemInfos);
    }
  });
});

router.post('/', function(req, res) {
  systemInfoFactory.create(req.body, function(err, systemInfo) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(systemInfo);
    }
  });
});

router.get('/:id', function(req, res) {
  systemInfoFactory.findOne(req.params.id, req.queryOptions, function(err, systemInfo) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (systemInfo) {
      return res.json(systemInfo);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

router.put('/:id', function(req, res) {
  systemInfoFactory.update(req.params.id, req.queryOptions, req.body, function(err, systemInfo) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(systemInfo);
    }
  });
});

module.exports = router
