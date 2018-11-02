/*
jobFactory handles interaction with jobs.
*/
var fs = require('fs');

module.exports = {

  // Query jobs.
  query: function(params, {}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    fs.readdir('./jobs/scripts/', function(err, files) {
      if(err) {
        callback(err);
      } else {
        var scripts = [];
        files.forEach(function(file) {
          scripts.push(file.substring(0, file.indexOf('.js')));
        });
        callback(err, scripts);
      }
    });
  },

  // Run a job
  run: function(id, callback) {
    require('../jobs/scripts/'+id).run();
    callback();
  }
}
