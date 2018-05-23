var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Role = require('../models/role');
var Error = require('../utils/error');

router.get('/', function(req, res){
  User.find(req.query)
  .populate('role')
  .exec(function(err, users) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(users);
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
            return res.status(500).json(new Error(err));
          } else {
            return res.json(user);
          }
        });
      } else {
        return res.status(404).json(new Error('Role not found'));
      }
    });
  } else {
    createUser(req, function(err, user) {
      if (err) {
        return res.status(500).json(new Error(err));
      } else {
        return res.json(user);
      }
    });
  }
});

router.get('/:id', function(req, res) {
  req.query._id = req.params.id;
  User.findOne(req.query)
  .exec(function(err, user) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else if (user) {
      return res.json(user);
    } else {
      return res.status(404).json(new Error('User not found'));
    }
  });
});

router.put('/:id', function(req, res) {
  modifyUser(req, function(err, user) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(user);
    }
  });
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

function modifyUser(req, callback) {
  req.query._id = req.params.id;
  User.findOne(req.query)
  .exec(function(err, user) {
    if (err) {
      callback(err, null);
    } else if (user) {
      if(req.body.name) user.name = req.body.name;
      if(req.body.username) user.username = req.body.username;
      if(req.body.email) user.email = req.body.email;
      if(req.body.phone) user.phone = req.body.phone;
      if(req.body.password) user.password = req.body.password;

      user.save(function(err) {
        if (err) {
          callback(err, null);
        } else {
          user.password = undefined;  // Remove the password from response
          callback(null, user);
        }
      });
    } else {
      callback("User not found", null);
    }
  });
}

module.exports = router
