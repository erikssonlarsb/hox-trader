const express = require('express');
const router = express.Router();
const userFactory = require('../factories/userFactory');
const Error = require('../utils/error');

router.post('/', function(req, res) {
  req.body.role = "000000000000000000000002";  // Hard code to "trader"
  userFactory.create(req.body, function(err, user) {
    if (err) {
      return res.status(err.code || 500).json(new Error(err));
    } else {
      return res.json(user);
    }
  });
});

module.exports = router
