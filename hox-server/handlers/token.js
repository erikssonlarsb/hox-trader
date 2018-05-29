const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');

router.get('/', function(req, res) {
  var token = jwt.sign({user: req.user}, new Buffer(config.jwtSecret, 'base64'), {expiresIn: config.jwtExpiry});
  return res.json({token: token});
});

module.exports = router
