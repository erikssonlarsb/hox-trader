var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res){
  User.find({}, function(err, users) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(users);
    }
  });
});

router.post('/', function(req, res){
  var user = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone
  });

  user.save(function(err) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(user);
    }
  });
});

router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (user) {
      res.json(user);
    } else {
      res.status(404).send();  // No user found
    }
  });
});

module.exports = router
