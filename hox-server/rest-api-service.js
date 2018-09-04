/**
 * Rest Api Service handles authentication and routing of http requests to
 * the rest api endpoints.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const auth = require('./utils/auth');
const queryEnhancer = require('./utils/queryEnhancer');

function init() {
  const api = express();

  api.use(compression());
  api.use(bodyParser.json());
  api.use(queryEnhancer.queryEnhancer());

  api.use('/registration', require('./handlers/registration'));
  api.use('/systeminfo', auth(), require('./handlers/systemInfo'));
  api.use('/invites', auth(), require('./handlers/invites'));
  api.use('/token', auth(), require('./handlers/token'));
  api.use('/users', auth('_id'), require('./handlers/users'));
  api.use('/roles', auth(), require('./handlers/roles'));
  api.use('/instruments', auth(), require('./handlers/instruments'));
  api.use('/orders', auth('user'), require('./handlers/orders'));
  api.use('/prices', auth(), require('./handlers/prices'));
  api.use('/trades', auth('user'), require('./handlers/trades'));
  api.use('/tickers', auth(), require('./handlers/tickers'));
  api.use('/orderdepths', auth(), require('./handlers/orderdepths'));
  api.use('/settlements', auth('user'), require('./handlers/settlements'));
  api.use('/jobs', auth(), require('./handlers/jobs'));

  return api;
}

module.exports = init;
