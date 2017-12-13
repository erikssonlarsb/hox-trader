var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Role = require('../models/role');

router.get('/', function(req, res){
  var query = {};
  if (!req.auth.user.role.isAdmin) {
    query._id = req.auth.user._id;
  }
  User.find(query)
  .populate('role')
  .exec(function(err, users) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(users);
    }
  });
});

router.post('/', function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.body.role)) {
    Role.findOne({name: req.body.role}, function(err, role) {
      if (role) {
        req.body.role = role._id;
        createUser(req, function(err, user) {
          if (err) {
            res.status(500).json({'error': err});
          } else {
            res.json(user);
          }
        });
      } else {
        res.status(500).json({'error': "Role not found."});
      }
    });
  } else {
    createUser(req, function(err, user) {
      if (err) {
        res.status(500).json({'error': err});
      } else {
        res.json(user);
      }
    });
  }
});

function createUser(req, callback) {
  var user = new User({
    name: req.body.name,
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone
  });

  user.save(function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}

router.get('/:id', function(req, res){
  var query = {_id: req.params.id};
  if (!req.auth.user.role.isAdmin) {
    query._id = req.auth.user._id;
  }
  User.findOne(query)
  .populate('role')
  .exec(function(err, user) {
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
