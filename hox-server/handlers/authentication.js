var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/user');
var Error = require('../utils/error');

router.post('/', function(req, res){
  User.findOne({username: req.body.username.trim().toLowerCase()})
  .populate('role')
  .populate('isAdmin')
  .exec(function(err, user) {
    if (err) {
      res.status(500).json(new Error(err));
    } else {
      if (!user) {
        res.status(401).json(new Error('Username or password incorrect.'));
      } else {
        // test a matching password
        user.verifyPassword(req.body.password, function(err, isMatch) {
          if (err) {
            res.status(401).json(new Error(err));
          } else {
            if (isMatch) {
              var token = jwt.sign({user: user}, new Buffer(config.jwtSecret, 'base64'), {expiresIn: config.jwtExpiry});
              res.json({token: token});
            } else {
              res.status(401).json(new Error('Username or password incorrect.'));
            }
          }
        });
      }
    }
  });
});

module.exports = router
