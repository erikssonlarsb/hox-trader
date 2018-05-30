/**
 * api-seed updates the admin user password (if customized),
 * as well as inserts data into the database from import files.
 */
const fs = require('fs');
const request = require('request');
const async = require('async');
const config = require('./config');

async.series([
  function(callback) {
    /*
    Synchronize admin user password on first start container startup.
     */

    // First do a trial request with custom password to see if it's already set.
    let options = {
      method: 'GET',
      uri: config.url + 'token',
      auth: { user: 'admin1', password: config.password },  // use custom password
      rejectUnauthorized: false
    };
    request(options, function(err, response, body) {
      if(err) {
        // Non http error.
        callback(err);
      } else if (response.statusCode == 200) {
        // Request successful with custom password.
        console.log("Admin password already synchronized.");
        callback();
      } else {
        // Request unsuccessful. Change from default to custom password.
        options = {
          method: 'PUT',
          uri: config.url + 'users/admin1?_idField=username',
          auth: { user: 'admin1', password: 'admin1' },  // Default values from mongo-seed
          json: { 'password': config.password },  // Update to custom password
          rejectUnauthorized: false
        };
        request(options, function(err, response, body) {
          if(err) {
            console.error(err);
          } else if (response.statusCode != 200) {
            console.error(body);
          } else {
            console.log("Successfully updated admin user password.");
          }
          callback(err);
        });
      }
    });
  },
  function(callback) {
    /*
    Parse named import files and POST to api.
     */
    for (const fileName of config.importFiles) {
      fs.readFile('./files/'+fileName+'.json', 'utf8', function(err, json) {
        if (err) {
          console.error(err);
        } else {
          const content = JSON.parse(json);
          for(const [route, objects] of Object.entries(content)) {
            async.eachSeries(objects, function(object, callback) {
              let options = {
                method: 'POST',
                uri : config.url + route,
                auth: { user: config.username, password: config.password },
                json: object,
                rejectUnauthorized: false
              };
              request(options, function(err, response, body) {
                if(err) {
                  callback(err);
                } else if (response.statusCode != 200 && body.code != 11000) {
                  // Other error than duplicate error (code 11000);
                  callback(body);
                }
                callback();
              });
            }, function(err) {
              if(err) {
                console.error("Failed to process " + fileName + ":" + route);
              } else {
                console.log("Successfully processed " + fileName + ":" + route);
              }
              callback(err);
            });
          }
        }
      });
    }
  }
],
function(err) {
  if(err) {
    console.error(err);
  } else {
    console.log("Finished successfully.");
  }
});
