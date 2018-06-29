const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const auth = require('./utils/auth');
const queryEnhancer = require('./utils/queryEnhancer');
const scheduler = require('./jobs/scheduler');
const eventEmitter = require('./events/eventEmitter');

require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server: server,
  path: '/ws',
  verifyClient: function(info, callback) {
    const token = info.req.headers['sec-websocket-protocol'];
    if (!token) {
      callback(false, 401, 'Unauthorized');
    } else {
      jwt.verify(token, new Buffer(config.jwtSecret, 'base64'), function (err, decoded) {
        if (err) {
          callback(false, 401, 'Unauthorized');
        } else {
          info.req.user = decoded.user;
          callback(true);
        }
      });
    }
  }
});

/*
 * REST API
 */
app.use(compression());
app.use(bodyParser.json());
app.use(queryEnhancer());

app.use('/api/registration', require('./handlers/registration'));
app.use('/api/systeminfo', auth(), require('./handlers/systemInfo'));
app.use('/api/invites', auth('inviter'), require('./handlers/invites'));
app.use('/api/token', auth(), require('./handlers/token'));
app.use('/api/users', auth('_id'), require('./handlers/users'));
app.use('/api/roles', auth(), require('./handlers/roles'));
app.use('/api/instruments', auth(), require('./handlers/instruments'));
app.use('/api/orders', auth('user'), require('./handlers/orders'));
app.use('/api/prices', auth(), require('./handlers/prices'));
app.use('/api/trades', auth('user'), require('./handlers/trades'));
app.use('/api/tickers', auth(), require('./handlers/tickers'));
app.use('/api/orderdepths', auth(), require('./handlers/orderdepths'));
app.use('/api/settlements', auth('user'), require('./handlers/settlements'));
app.use('/api/jobs', auth(), require('./handlers/jobs'));

/*
 * Socket API
 */
wss.on('connection', function(ws, req) {
  ws.user = req.user;
  req.user = undefined;
  console.log(ws.user.name + " connected");
  ws.on('message', function(message) {
    message = JSON.parse(message);
    switch(message.type) {
      case 'Populate':
        ws.populate = message.data.populate;
        break;
      default:
        console.error("Unsupported message type: " + message.type);
    }
  });

  ws.on('close', function() {
    console.log(ws.user.name + " disconnected");
  });
});

// Broadcast saved document to all clients.
eventEmitter.on('save', function(event) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      const typePermission = client.user.role.permissions.find(function(permission) {
        if (permission.resource == event.docType.toLowerCase()+'s') {
          return true;
        }
      });
      if(typePermission) {
        switch (expression) {
          case expression:

            break;
          default:

        }

        if(client.populate) {
          event.document.populate(client.populate, function(err, document) {
            if(err) {
              console.error(err);
            } else {
              event.document = document;
              client.send(JSON.stringify(event));
            }
          });
        } else {
          client.send(JSON.stringify(event));
        }
      }
    }
  });
});

var connectWithRetry = function() {
  console.log('Connecting to database: %s.', config.dbURL);
  return mongoose.connect(config.dbURL, {server: {ssl: config.dbUseSSL}, user: config.dbUser, pass: config.dbPassword, auth: {authdb: config.dbAuth}}, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected do database.');
      server.listen(config.apiPort, function() {
        console.log('Running on port: %s.', config.apiPort);
        console.log('Initiating jobs.');
        scheduler.init();
      });
    }
  });
};
connectWithRetry();
