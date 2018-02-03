var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
      res.status(500).json({'error': err})
    } else {
      res.sendStatus(201);
    }
  });
});

module.exports = router
