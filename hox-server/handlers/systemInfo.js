const express = require('express');
const router = express.Router();
const systemInfoFactory = require('../factories/systemInfoFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  systemInfoFactory.findOne(req.query, req.queryOptions, function(err, systemInfo) {
    if (err) {
      return res.status(err.code || 500).json(new Error(err));
    } else {
      return res.json(systemInfo);
    }
  });
});

router.put('/', function(req, res) {
  systemInfoFactory.create(req.body, function(err, systemInfo) {
    if (err) {
      return res.status(err.code || 500).json(new Error(err));
    } else {
      return res.json(systemInfo);
    }
  });
});

module.exports = router
