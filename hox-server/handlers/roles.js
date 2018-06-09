const express = require('express');
const router = express.Router();
const roleFactory = require('../factories/roleFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  roleFactory.query(req.query, req.queryOptions, function(err, roles) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(roles);
    }
  });
});

router.post('/', function(req, res) {
  roleFactory.create(req.body, function(err, role) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(role);
    }
  });
});

router.get('/:id', function(req, res) {
  roleFactory.findOne(req.params.id, req.queryOptions, function(err, role) {
    if(err) {
      return res.status(500).json(new Error(err));
    } else if (role) {
      return res.json(role);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

module.exports = router
