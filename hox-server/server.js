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
const ConnectionEvent = require('./events/event.connection');
const DocumentEvent = require('./events/event.document');
const orderDepthFactory = require('./factories/orderDepthFactory');
const tickerFactory = require('./factories/tickerFactory');

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
app.use(queryEnhancer.queryEnhancer());

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
  ws.populate = {};
  console.log(ws.user.name + " connected");
  ws.on('message', function(message) {
    message = JSON.parse(message);
    switch(message.type) {
      case 'Populate':
        ws.populate[message.data.docType] = queryEnhancer.getPopulate(JSON.stringify(message.data.populate));
        break;
      default:
        console.error("Unsupported message type: " + message.type);
    }
  });

  ws.send(JSON.stringify(new ConnectionEvent('Connected', ws.user.name + ' successfully connected.')))

  ws.on('close', function() {
    console.log(ws.user.name + " disconnected");
  });
});

// Broadcast document to clients.
eventEmitter.on('DocumentEvent', function(event) {

  // Trigger events for any dependent models
  switch (event.docType) {
    case 'Instrument':
      if(event.operation == 'Create') {
        orderDepthFactory.findOne(event.document._id, function(err, orderDepth) {
          if(err) {
            console.error(err);
          } else if (orderDepth) {
            eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'OrderDepth', orderDepth));
          }
        });
      }
      break;
    case 'Order':
      orderDepthFactory.findOne(event.document.instrument, function(err, orderDepth) {
        if(err) {
        } else if (orderDepth) {
          eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'OrderDepth', orderDepth));
        }
      });
      break;
    case 'Trade':
      if(event.operation == 'Create' && event.document.side == 'BUY') {  // Only create ticker for 1 side of the trade-pairs
        tickerFactory.findOne(event.document._id, function(err, ticker) {
          if(err) {
          } else if (ticker) {
            eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Ticker', ticker));
          }
        });
      }
      break;
  }

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      const typePermission = client.user.role.permissions.find(function(permission) {
        if (permission.resource == event.docType.toLowerCase()+'s') {
          return true;
        }
      }).resource;

      let userPermission = false;

      if(client.user.role.isAdmin) {
        userPermission = true;
      } else {
        switch (event.docType) {
          case 'Instrument':
            userPermission = true;
            break;
          case 'Invite':
            userPermission = event.document.inviter == client.user._id;
            break;
          case 'Order':
            userPermission = event.document.user == client.user._id;
            break;
          case 'OrderDepth':
            userPermission = true;
            break;
          case 'Price':
            userPermission = true;
            break;
          case 'Role':
            userPermission = true;
            break;
          case 'Settlement':
            userPermission = event.document.user == client.user._id;
            break;
          case 'SystemInfo':
            userPermission = true;
            break;
          case 'Ticker':
            userPermission = true;
            break;
          case 'Trade':
            userPermission = event.document.user == client.user._id;
            break;
          case 'User':
            userPermission = event.document._id == client.user._id;;
            break;
          default:
            userPermission = false;
        }
      }

      if(typePermission && userPermission) {
        if(client.populate.hasOwnProperty(event.docType)) {
          try {
            let populate = null;
            if(mongoose.modelSchemas[event.docType] && typeof(mongoose.model(event.docType).sanitizePopulate) === 'function') {
              populate = mongoose.model(event.docType).sanitizePopulate(client.populate[event.docType]);
            } else {
              populate = client.populate[event.docType];
            }
            event.document.populate(populate, function(err, document) {
              if(err) {
                console.error("Population error: " + err);
              } else {
                event.document = document;
                client.send(JSON.stringify(event));
              }
            });
          } catch (err) {
            console.error(err);
          }
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
