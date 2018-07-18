const express = require('express');
const proxy = require('http-proxy-middleware');

const certbot = proxy({target: 'http://certbot'});

const proxyServer = express();
proxyServer.use('/.well-known/acme-challenge/', certbot);
proxyServer.use('*', function(req, res, next) {
  res.redirect('https://' + req.headers.host + req.url);
});
proxyServer.listen(80);
