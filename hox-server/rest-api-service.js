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

  api.use('/registration',                          require('./handlers/registration'));
  api.use('/systeminfo',  auth.authorizeRequest(),  require('./handlers/systemInfo'));
  api.use('/invites',     auth.authorizeRequest(),  require('./handlers/invites'));
  api.use('/token',       auth.authorizeRequest(),  require('./handlers/token'));
  api.use('/users',       auth.authorizeRequest(),  require('./handlers/users'));
  api.use('/roles',       auth.authorizeRequest(),  require('./handlers/roles'));
  api.use('/instruments', auth.authorizeRequest(),  require('./handlers/instruments'));
  api.use('/orders',      auth.authorizeRequest(),  require('./handlers/orders'));
  api.use('/prices',      auth.authorizeRequest(),  require('./handlers/prices'));
  api.use('/trades',      auth.authorizeRequest(),  require('./handlers/trades'));
  api.use('/tickers',     auth.authorizeRequest(),  require('./handlers/tickers'));
  api.use('/orderdepths', auth.authorizeRequest(),  require('./handlers/orderdepths'));
  api.use('/settlements', auth.authorizeRequest(),  require('./handlers/settlements'));
  api.use('/jobs',        auth.authorizeRequest(),  require('./handlers/jobs'));

  return api;
}

module.exports = init;
