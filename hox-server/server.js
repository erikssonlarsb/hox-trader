var app = require('express')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });
var config = require('./config');
var authorize = require('./utils/authorize');
var scheduler = require('./jobs/scheduler')

app.use(bodyParser.urlencoded({extended: false}));  // Form for authentication
app.use(bodyParser.json());

/*
* Routes
*/
app.use('/api/registration', require('./handlers/registration'));
app.use('/api/authentication', require('./handlers/authentication'));
app.use('/api/users', authorize('_id'), require('./handlers/users'));
app.use('/api/roles', authorize(), require('./handlers/roles'));
app.use('/api/instruments', authorize(), require('./handlers/instruments'));
app.use('/api/orders', authorize('user'), require('./handlers/orders'));
app.use('/api/prices', authorize(), require('./handlers/prices'));
app.use('/api/trades', authorize('user'), require('./handlers/trades'));
app.use('/api/orderdepths', authorize(), require('./handlers/orderdepths'));
app.use('/api/settlements', authorize('user'), require('./handlers/settlements'));
app.use('/api/jobs', authorize(), require('./handlers/jobs'));



console.log('Connecting to database: %s.', config.database);

var connectWithRetry = function() {
  return mongoose.connect(config.database, {server: {ssl: config.use_ssl}, user: config.db_user, pass: config.db_password, auth: {authdb: config.db_auth}}, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected do database.');
      app.listen(config.port, function() {
        console.log('Running on port: %s.', config.port);
        console.log('Initiating jobs.');
        scheduler.init();
      });
    }
  });
};
connectWithRetry();
