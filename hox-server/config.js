var database = process.env.DATABASE || 'localhost:27017';
var port = process.env.PORT || 3000;
var jwtSecret = process.env.JWTSECRET || '5uper5ecretJW7';

module.exports = {
  'database': 'mongodb://' + database,
  'port': port,
  'jwtSecret': jwtSecret,
  'jwtExpiry': 86400  // jwt session TTL in seconds (86400 = 1 day)
};
