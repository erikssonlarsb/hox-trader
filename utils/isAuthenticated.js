var jwt = require('jsonwebtoken');
var config = require('../config');

function isAuthenticated(req, res, next) {
  try {
    var token = req.headers['authorization'].replace('Bearer ', '');
    if (token) {
      jwt.verify(token, config.jwtSecret, function(err, decoded) {
        if (err) {
          return res.status(403).json({message: 'Failed to authenticate token.'});
        } else {
          req.auth = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({message: 'No token provided.'});
    }
  } catch (err) {
    return res.status(403).json({message: 'No token provided.'});
  }
}

module.exports = isAuthenticated
