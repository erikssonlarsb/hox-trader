const crypto = require('crypto');

var dbURL = process.env.DB_URL || 'localhost:27017';
var dbUser = process.env.DB_USER || 'root';
var dbPassword = process.env.DB_PASSWORD || 'Aaa12345';
var dbAuth = process.env.DB_AUTH || 'admin';
var dbUseSSL = process.env.DB_USE_SSL || true;
var apiPort = process.env.API_PORT || 3000;
var jwtExpiry = Number(process.env.JWT_EXPIRY) || 86400;  // jwt session TTL in seconds (86400 = 1 day)
var jwtRandomizeSecret = process.env.JWT_RANDOMIZE_SECRET || false;
var jwtSecret = process.env.JWT_SECRET || '5uper5ecretJW7';

if(jwtRandomizeSecret) {
  jwtSecret = crypto.randomBytes(128).toString('hex');
}

module.exports = {
  'dbURL': 'mongodb://' + dbURL,
  'dbUser': dbUser,
  'dbPassword': dbPassword,
  'dbAuth': dbAuth,
  'dbUseSSL': dbUseSSL,
  'apiPort': apiPort,
  'jwtSecret': jwtSecret,
  'jwtExpiry': jwtExpiry
};
