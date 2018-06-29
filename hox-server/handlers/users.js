const express = require('express');
const router = express.Router();
const userFactory = require('../factories/userFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  userFactory.query(req.query, req.queryOptions, function(err, users) {
    if (err) {
      return res.status(err.code || 500).json(new Error(err));
    } else {
      return res.json(users);
    }
  });
});

router.post('/', function(req, res) {
  userFactory.create(req.body, function(err, user) {
    if (err) {
      return res.status(err.code || 500).json(new Error(err));
    } else {
      return res.json(user);
    }
  });
});

router.get('/:id', function(req, res) {
  userFactory.findOne(req.params.id, req.queryOptions, function(err, user) {
    if(err) {
      return res.status(err.code || 500).json(new Error(err));
    } else if (user) {
      return res.json(user);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

router.put('/:id', function(req, res) {
  userFactory.update(req.params.id, req.queryOptions, req.body, function(err, user) {
    if (err) {
      return res.status(err.code || 500).json(new Error(err));
    } else if (user) {
      return res.json(user);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

module.exports = router
