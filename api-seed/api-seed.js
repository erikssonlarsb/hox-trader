/**
 * api-seed updates the admin user password (if customized),
 * as well as inserts data into the database from import files.
 */
const fs = require('fs');
const request = require('request');
const async = require('async');
const config = require('./config');

let serverSystemInfo = {};  // Populated from test response. Used to decide seeding.

async.series([
  function(callback) {
    /*
    Make request to systeminfo to check if custom admin password has been set,
    and if the database has already been seeded.
     */
     let options = {
       method: 'GET',
       uri: config.url + 'systeminfo',
       auth: { user: 'admin1', password: config.password },  // use custom password
       json: true,
       rejectUnauthorized: false
     };
     request(options, function(err, response, body) {
       if(err) {
         callback(err);  // Break series due to connection error.
       } else if (response.statusCode == 200) {
         // Request successful with custom password.
         console.log("Admin password in sync.");
         if(body) {
           // Save system info object for later processing.
           serverSystemInfo = body;
         }
         callback();  // Proceed with next in series.
       } else if (response.statusCode == 401) {
         // Request unauthorized. Change from default to custom password.
         options = {
           method: 'PUT',
           uri: config.url + 'users/admin1?_idField=username',
           auth: { user: 'admin1', password: 'admin1' },  // Default values from mongo-seed
           json: { 'password': config.password },  // Update to custom password
           rejectUnauthorized: false
         };
         request(options, function(err, response, body) {
           if(err) {
             callback(err);  // Break series due to connection error.
           } else if (response.statusCode != 200) {
             callback(body);  // Break due to unsuccessful update.
           } else {
             console.log("Successfully updated admin user password.");
             callback();  // Proceed with next in series.
           }
         });
       } else {
         callback(body);  // Break due to other request error.
       }
     });
  },
  function(callback) {
    /*
    Update SystemInfo.
     */
    if(serverSystemInfo.version == config.gitCommit) {
      console.log("Restart with same version.");
      callback();
    } else {
      console.log("Deploying new version: " + config.gitCommit);
      let systemInfo = {
        version: config.gitCommit,
        isSeeded: true
      };
      // First do a trial request with custom password to see if it's already set.
      let options = {
        method: 'PUT',
        uri: config.url + 'systeminfo',
        auth: { user: 'admin1', password: config.password },  // use custom password
        json: systemInfo,
        rejectUnauthorized: false
      };
      request(options, function(err, response, body) {
        if(err) {
          callback(err);  // Break series due to connection error.
        } else if (response.statusCode == 200) {
          // Request successful.
          console.log("SystemInfo updated.");
          callback();
        } else {
          callback(body);
        }
      });
    }
  },
  function(callback) {
    /*
    Parse named import files and POST to api.
     */
    if(serverSystemInfo.isSeeded) {
      console.log("Already seeded.");
      callback();
    } else {
      console.log("Seeding database...");
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
                  } else {
                    callback();
                  }
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
  }
],
function(err) {
  if(err) {
    console.error(err);
    process.exit(1);  // Restart api-seed compose.
  } else {
    console.log("Finished successfully.");
  }
});
