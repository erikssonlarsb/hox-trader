var database = process.env.DATABASE || 'localhost:27017';
var db_user = process.env.DB_USER || 'root';
var db_password = process.env.DB_PASSWORD || 'Aaa12345';
var db_auth = process.env.DB_AUTH || 'admin';
var port = process.env.PORT || 3000;
var jwtSecret = process.env.JWTSECRET || '5uper5ecretJW7';

module.exports = {
  'database': 'mongodb://' + database,
  'db_user': db_user,
  'db_password': db_password,
  'db_auth': db_auth,
  'port': port,
  'jwtSecret': jwtSecret,
  'jwtExpiry': 86400  // jwt session TTL in seconds (86400 = 1 day)
};
