/**
 * Main module for hox-server. Connects to Mongo DB and initiates the http server.
 * The http server provides two web services; rest api and websocket.
 */
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const config = require('./config');
const restApiService = require('./rest-api-service');
const webSocketService = require('./ws-service');
const scheduler = require('./jobs/scheduler');

// Configure console log prints
require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });

// Create server and services
const app = express();
const api = restApiService();
app.use('/api', api);
const server = http.createServer(app);
const wss = webSocketService(server, '/ws');

function connectWithRetry() {
  // Startup process wrapped in a function in order to allow recursive retries.
  console.info('Connecting to database: %s...', config.dbURL);
  mongoose.connect(
    config.dbURL,
    {
      dbName: config.dbName,
      useMongoClient: true,
      ssl: config.dbUseSSL,
      user: config.dbUser,
      pass: config.dbPassword,
      auth: {authdb: config.dbAuth}
    },
  function(err) {
    if (err) {
      console.error('Failed to connect to Mongo DB - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.info('Connected do database.');
      console.info('Initiating server...');
      server.listen(config.apiPort, function(err) {
        if (err) {
          console.error('Failed to initiate web server - retrying in 5 sec', err);
          setTimeout(connectWithRetry, 5000);
        } else {
          console.info("Server running on: " + this.address().address + ":" + this.address().port);
          console.info("Rest API available on path: " + api.mountpath);
          console.info("Web Socket available on path: " + wss.options.path);
          console.info('Initiating jobs...');
          scheduler.init();
        }
      });
    }
  });
};

connectWithRetry();  // Initiate startup
