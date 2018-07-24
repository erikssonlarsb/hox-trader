/**
 * Certproxy has two purposes:
 *  1)  Handle generation of ssl certificates; either using let's encrypt,
 *      if deployed with a dedicated domain; or issuing a self-signed cert,
 *      if deployed in test or without a domain.
 *  2)  Redirect http requests to https (handled by the Nginx reverse proxy).
 */
const express = require('express');
const proxy = require('http-proxy-middleware');
const config = require('./config');
const selfSigned = require('./utils/selfsigned');
const letsEncrypt = require('./utils/letsencrypt');

const httpServer = express();
httpServer.use('/.well-known/acme-challenge/', proxy({target: `http://localhost:${config.certbotPort}`}));
httpServer.use('*', function(req, res, next) {
  res.redirect('https://' + req.headers.host + req.url);
});
httpServer.listen(80, function() {
  console.log("Listening http requests on", this.address());
});

if(!config.domain || config.domain == "selfsigned") {
  // Generate self-signed certificate
  selfSigned.verify(function(err, isValid) {
    if(err) {
      console.log(err);
    }
    if(err || !isValid) {
      console.log("No valid certificate. Creating new.");
      selfSigned.create(function(err, keys) {
        if(err) {
          console.log(err);
        } else {
          console.log("Selfsigned certificate successfully created.");
        }
      });
    }
  });

} else {
  // Use Certbot to generate Let's Encrypt certificate
  if(!config.email) {
    console.error("Email required for Let's Encrypt certificate generation");
  } else {
    letsEncrypt.create(config.environment, config.certbotPort, config.email, config.domain, function(err) {
      if(err) {
        console.error(err);
      } else {
        console.log("Let's Encrypt certificate successfully created.");
      }
    });
  }
}
