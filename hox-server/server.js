var app = require('express')();
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });
var config = require('./config');
var auth = require('./utils/auth');
var scheduler = require('./jobs/scheduler');

app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));  // Form for authentication
app.use(bodyParser.json());

/*
 * Routes
 */
app.use('/api/registration', require('./handlers/registration'));
app.use('/api/token', auth(), require('./handlers/token'));
app.use('/api/users', auth('_id'), require('./handlers/users'));
app.use('/api/roles', auth(), require('./handlers/roles'));
app.use('/api/instruments', auth(), require('./handlers/instruments'));
app.use('/api/orders', auth('user'), require('./handlers/orders'));
app.use('/api/prices', auth(), require('./handlers/prices'));
app.use('/api/trades', auth('user'), require('./handlers/trades'));
app.use('/api/orderdepths', auth(), require('./handlers/orderdepths'));
app.use('/api/settlements', auth('user'), require('./handlers/settlements'));
app.use('/api/jobs', auth(), require('./handlers/jobs'));



console.log('Connecting to database: %s.', config.dbURL);

var connectWithRetry = function() {
  return mongoose.connect(config.dbURL, {server: {ssl: config.dbUseSSL}, user: config.dbUser, pass: config.dbPassword, auth: {authdb: config.dbAuth}}, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected do database.');
      app.listen(config.apiPort, function() {
        console.log('Running on port: %s.', config.apiPort);
        console.log('Initiating jobs.');
        scheduler.init();
      });
    }
  });
};
connectWithRetry();
