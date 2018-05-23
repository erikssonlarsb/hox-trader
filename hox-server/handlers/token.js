var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/user');
var Error = require('../utils/error');

router.get('/', function(req, res) {
  var token = jwt.sign({user: req.user}, new Buffer(config.jwtSecret, 'base64'), {expiresIn: config.jwtExpiry});
  return res.json({token: token});
});

module.exports = router
