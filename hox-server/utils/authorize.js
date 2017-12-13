var jwt = require('jsonwebtoken');
var config = require('../config');

function authorize(req, res, next) {
  authenticate(req).then(function(req) {
    return checkPermissions(req);
  }).then(function() {
    next();
  }).catch(function(err) {
    return res.status(err.code).json({message: err.msg});
  })
}

function authenticate(req) {
  return new Promise(function(resolve, reject) {
    try {
      var token = req.headers['authorization'].replace('Bearer ', '');
      if (token) {
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
          if (err) {
            reject({code: 401, msg: 'Failed to authenticate token.'});
          } else {
            req.auth = decoded;
            resolve(req);
          }
        });
      } else {
        reject({code: 401, msg: 'No token provided.'})
      }
    } catch (err) {
      reject({code: 401, msg: 'No token provided.'})
    }
  });
}

function checkPermissions(req) {
  return new Promise(function(resolve, reject) {
    var permission = req.auth.user.role.permissions.find(function(permission) {
      if (permission.resource == req.baseUrl.replace('/api/','')) {
        return true;
      }
    });
    if(permission && permission.methods.indexOf(req.method) > -1) {
      resolve(true);
    } else {
      reject({code: 405, msg: 'Permission denied for method ' + req.method});
    }
  });
}

module.exports = authorize
