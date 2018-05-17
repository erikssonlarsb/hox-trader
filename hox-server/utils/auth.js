var jwt = require('jsonwebtoken');
var config = require('../config');
var Error = require('../utils/error');

function auth(userField) {
  return function(req, res, next) {
    try {

      //  Authenticate token
      if (!req.headers['authorization']) {
        throw {code: 401, message: 'No token provided.'};
      } else {
        jwt.verify(req.headers['authorization'].replace('Bearer ', ''), new Buffer(config.jwtSecret, 'base64'), function(err, decoded) {
          if (err) {
            throw {code: 401, message: 'Failed to authenticate token.'};
          } else {
            req.auth = decoded;
          }
        });
      }

      //  Verify permissions to the requested resource
      var permission = req.auth.user.role.permissions.find(function(permission) {
        if (permission.resource == req.baseUrl.replace('/api/', '')) {
          return true;
        }
      });
      if(!permission || permission.methods.indexOf(req.method) <= -1) {
        throw {code: 405, message: 'Permission denied for method ' + req.method};
      }

      //  Add user to the request query in order to control access
      //  to user-specific documents in handlers.
      if (userField && !req.auth.user.role.isAdmin) {
        req.query[userField] = req.auth.user._id;
      }

      //  All authentication steps passed.
      next();

    } catch (error) {
      return res.status(error.code).json(new Error(error.message));
    }
  }
}

module.exports = auth
