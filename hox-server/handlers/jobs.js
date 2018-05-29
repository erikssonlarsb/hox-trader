const express = require('express');
const router = express.Router();
const jobFactory = require('../factories/jobFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  jobFactory.query(req.query, req.queryOptions, function(err, jobs) {
    if(err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(jobs);
    }
  });
});

router.put('/:id/run', function(req, res) {
  jobFactory.run(req.params.id, function(err, result) {
    if(err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.status(202).end();
    }
  });
});

module.exports = router
