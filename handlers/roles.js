var express = require('express');
var router = express.Router();
var Role = require('../models/role');

router.get('/', function(req, res){
  Role.find({}, function(err, roles) {
    if (err) {
      res.status(500).json({'error': err})
    } else {
      res.json(roles);
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
      res.status(500).json({'error': err})
    } else {
      res.json(role);
    }
  });
});

router.get('/:id', function(req, res){
  Role.findById(req.params.id, function(err, role) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (role) {
      res.json(role);
    } else {
      res.status(404).send();  // No user found
    }
  });
});

module.exports = router
