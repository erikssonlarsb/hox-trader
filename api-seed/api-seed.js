const fs = require('fs');
const request = require('request');
const config = require('./config');

for (const fileName of config.importFiles) {
  fs.readFile('./files/'+fileName+'.json', 'utf8', function(err, json) {
    if (err) {
      console.error(err);
    } else {
      const content = JSON.parse(json);
      for(const [route, objects] of Object.entries(content)) {
        for(const object of objects) {
          let options = {
            method: 'POST',
            uri : config.apiUrl + route,
            auth: {
              user: config.apiUser,
              password: config.apiPassword
            },
            json: object,
            rejectUnauthorized: false
          };

          request(options, function(err, response, body) {
            if(err) {
              console.error(err);
            } else if (response.statusCode != 200) {
              console.log(body);
            }
          });
        }
      }
    }
  });
}
