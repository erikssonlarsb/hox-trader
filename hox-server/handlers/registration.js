var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Error = require('../utils/error');

router.post('/', function(req, res){
  var user = new User({
    name: req.body.name,
    role: "000000000000000000000002",
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone
  });

  user.save(function(err) {
    if (err) {
      res.status(500).json(new Error(err.errmsg, err.code));
    } else {
      res.status(201).send();
    }
  });
});

module.exports = router
