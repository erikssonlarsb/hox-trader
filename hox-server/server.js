var app = require('express')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var authorize = require('./utils/authorize');

app.use(bodyParser.urlencoded({extended: false}));  // Form for authentication
app.use(bodyParser.json());

/*
* Routes
*/
app.use('/api/authentication', require('./handlers/authentication'));
app.use('/api/users', authorize, require('./handlers/users'));
app.use('/api/roles', authorize, require('./handlers/roles'));
app.use('/api/instruments', authorize, require('./handlers/instruments'));
app.use('/api/orders', authorize, require('./handlers/orders'));
app.use('/api/trades', authorize, require('./handlers/trades'));
app.use('/api/orderdepths', authorize, require('./handlers/orderdepths'));


console.log('Connecting to database: %s.', config.database);
mongoose.connect(config.database, {user: config.db_user, pass: config.db_password, auth: {authdb: config.db_auth}}, function(err) {
  if (err) {
    console.log('Could not connect to database: %s.', err);
    process.exit(1);
  } else {
    console.log('Connected do database.');
    app.listen(config.port, function() {
      console.log('Running on port: %s.', config.port);
    });
  }
});
