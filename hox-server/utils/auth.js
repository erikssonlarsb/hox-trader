var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/user');
var Error = require('../utils/error');

function auth(userField) {
  return function(req, res, next) {
    if (!req.headers['authorization']) {
      res.status(401).json(new Error('Authorization required.'));
    } else {
      let auth = req.headers['authorization'].split(' ');

      if(auth[0] == 'Bearer') {
        jwt.verify(auth[1], new Buffer(config.jwtSecret, 'base64'), function(err, decoded) {
          if (err) {
            res.status(401).json(new Error('Failed to authenticate token.'));
          } else {
            req.user = decoded.user;
            verifyPermissions(req, res, userField);
            next();
          }
        });
      } else if (auth[0] == 'Basic') {
        let credentials = new Buffer(auth[1], 'base64').toString().split(':');

        User.findOne({username: credentials[0].trim().toLowerCase()})
        .populate('role')
        .exec(function(err, user) {
          if (err) {
            res.status(500).json(new Error(err));
          } else {
            if (!user) {
              res.status(401).json(new Error('Username or password incorrect.'));
            } else {
              // test a matching password
              user.verifyPassword(credentials[1], function(err, isMatch) {
                if(err) {
                  res.status(500).json(new Error(err));
                } else if (!isMatch) {
                  res.status(401).json(new Error('Username or password incorrect.'));
                } else {
                  req.user = user;
                  verifyPermissions(req, res, userField);
                  next();
                }
              });
            }
          }
        });
      } else {
        res.status(401).json(new Error(auth[0] + ' authorization not supported.'));
      }
    }
  }
}

function verifyPermissions(req, res, userField) {
  //  Verify permissions to the requested resource
  var permission = req.user.role.permissions.find(function(permission) {
    if (permission.resource == req.baseUrl.replace('/api/', '')) {
      return true;
    }
  });
  if(!permission || permission.methods.indexOf(req.method) <= -1) {
    res.status(405).json(new Error('Permission denied for method ' + req.method));
  }

  //  Add user to the request query in order to control access
  //  to user-specific documents in handlers.
  if (userField && !req.user.role.isAdmin) {
    req.query[userField] = req.user._id;
  }
}

module.exports = auth
