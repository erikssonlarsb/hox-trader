const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const inviteFactory = require('../factories/inviteFactory');
const Error = require('../utils/error');

router.get('/', function(req, res) {
  inviteFactory.query(req.query, req.queryOptions, function(err, invites) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(invites);
    }
  });
});

router.post('/', function(req, res) {
  req.body.inviter = req.user._id;  // Hard set user
  inviteFactory.create(req.body, function(err, invite) {
    if (err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else {
      return res.json(invite);
    }
  });
});

router.get('/:id', function(req, res) {
  inviteFactory.findOne(req.params.id, req.queryOptions, function(err, invite) {
    if(err) {
      return res.status(HttpStatus.hasOwnProperty(err.code) ? err.code : 500).json(new Error(err));
    } else if (invite) {
      return res.json(invite);
    } else {
      return res.status(404).json(new Error("Not found"));
    }
  });
});

module.exports = router
