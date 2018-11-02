/**
 * WS Service handels websocket connections.
 *
 * Connections are initiates from the client; and authorized using jwt.
 *
 * The WS Server subscribes to Events from the eventEmitter. Events are then
 * distributed to connected clients (after authorization).
 *
 * Clients can send 'Populate' specifications that will be applied on Documents
 * before the Event is sent.
 */
const WebSocket = require('ws');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const auth = require('./utils/auth');
const queryEnhancer = require('./utils/queryEnhancer');
const eventEmitter = require('./events/eventEmitter');
const ConnectionEvent = require('./events/event.connection');
const DocumentEvent = require('./events/event.document');
const orderDepthFactory = require('./factories/orderDepthFactory');
const tickerFactory = require('./factories/tickerFactory');
const settlementFactory = require('./factories/settlementFactory');

function init(httpServer, path) {
  const wss = new WebSocket.Server({
    server: httpServer,
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

  wss.on('connection', function(ws, req) {
    ws.user = req.user;
    req.user = undefined;
    ws.populate = {};
    console.log(ws.user.name + " connected");
    ws.on('message', function(message) {
      message = JSON.parse(message);
      switch(message.type) {
        case 'Populate':
          ws.populate[message.data.docType] = queryEnhancer.getPopulate(JSON.stringify(message.data.populate)).map(populate => auth.authorizePopulate(populate, ws.user._id));
          break;
        default:
          console.error("Unsupported message type: " + message.type);
      }
    });
    ws.on('close', function() {
      console.log(ws.user.name + " disconnected");
    });
  });

  // Broadcast document to clients.
  eventEmitter.on('DocumentEvent', function(event, triggerDependants=true) {

    // Trigger events for any dependent models
    if (triggerDependants) {
      switch (event.docType) {
        case 'Instrument':
          if(event.operation == 'Create') {
            orderDepthFactory.findOne(event.document._id, {requester: 'admin'}, function(err, orderDepth) {
              if(err) {
                console.error(err);
              } else if (orderDepth) {
                eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'OrderDepth', orderDepth));
              }
            });
          }
          break;
        case 'Order':
          orderDepthFactory.findOne(event.document.instrument, {requester: 'admin'}, function(err, orderDepth) {
            if(err) {
            } else if (orderDepth) {
              eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'OrderDepth', orderDepth));
            }
          });
          break;
        case 'Trade':
          if(event.operation == 'Create' && event.document.side == 'BUY') {  // Only create ticker for 1 side of the trade-pairs
            tickerFactory.findOne(event.document._id, {requester: 'admin'}, function(err, ticker) {
              if(err) {
              } else if (ticker) {
                eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'Ticker', ticker));
              }
            });
          }
          break;
        case 'Settlement':
          if(event.operation == 'Update') {
            if(original) {
              // If it's the original Settlement update event, broadcast also an update on the counterparty settlement
              // If it's not the original update event, do nothing (prevent an infinite loop of updates triggering each other)
              settlementFactory.findOne(event.document.counterpartySettlement, {requester: 'admin'}, function(err, counterpartySettlement) {
                if(err) {
                } else if (counterpartySettlement) {
                  // Broadcast with original=false, to stop from further broadcasting.
                  eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'Settlement', counterpartySettlement), false);
                }
              });
            }
          }
          break;
      }
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const schema = mongoose.modelSchemas[event.docType];
        const typePermission = client.user.role.permissions.find(function(permission) {
          if (permission.resource == event.docType.toLowerCase()+'s') {
            return true;
          }
        }).resource;

        let userPermission = false;

        if(client.user.role.isAdmin) {
          userPermission = true;
        } else {
          if(schema && schema.auth) {
            // schema is user specific; check owner.
            let owner = event.document[schema.auth.ownerField];
            if(owner == client.user._id) {
              userPermission = true;
            }
          } else {
            // Public schema.
            userPermission = true;
          }
        }

        if(typePermission && userPermission) {
          if(client.populate.hasOwnProperty(event.docType)) {
            try {
              event.document.populate(client.populate[event.docType], function(err, document) {
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

  return wss;
}

module.exports = init;
