var express = require('express');
var router = express.Router();
var Role = require('../models/role');
var Error = require('../utils/error');

router.get('/', function(req, res){
  Role.find(req.query, function(err, roles) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(roles);
    }
  });
});

router.post('/', function(req, res){
  var role = new Role({
    name: req.body.name,
    permissions: req.body.permissions
  });

  role.save(function(err) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else {
      return res.json(role);
    }
  });
});

router.get('/:id', function(req, res){
  Role.findById(req.params.id, function(err, role) {
    if (err) {
      return res.status(500).json(new Error(err));
    } else if (role) {
      return res.json(role);
    } else {
      return res.status(404).send();  // No user found
    }
  });
});

module.exports = router
