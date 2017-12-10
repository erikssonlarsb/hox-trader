var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/user');

router.post('/', function(req, res){
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      if (!user) {
        res.status(401).json({message: 'Authentication failed. User not found.'});
      } else {
        // test a matching password
        user.verifyPassword(req.body.password, function(err, isMatch) {
          if (err) {
            res.status(401).json({message: err});
          } else {
            if (isMatch) {
              var token = jwt.sign({user: user}, config.jwtSecret, {
                expiresIn: config.jwtExpiry
              });
              res.json({
                token: token
              });
            } else {
              res.status(401).json({message: 'Authentication failed. Password incorrect.'});
            }
          }
        });
      }
    }
  });
});

module.exports = router
