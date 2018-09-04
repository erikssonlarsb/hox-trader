/*
systemInfoFactory handles database interaction for the systemInfo collection.
Since systemInfo is a singleton (only one document in collection),
handling differs somewhat from normal procedure.
*/
const SystemInfo = require('../models/systemInfo');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');
const Error = require('../utils/error');

module.exports = {

  // Query system info.
  query: function(params, {populate = ''}, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    SystemInfo.find(params)
    .populate(populate)
    .exec(function(err, prices) {
      callback(err, prices);
    });
  },

  // Find the systemInfo document (if created).
  findOne: function(id, queryOptions, callback) {
    if (typeof arguments[1] === 'function') callback = arguments[1];

    SystemInfo.findUnique(id, queryOptions, function(err, systemInfo) {
      callback(err, systemInfo);
    });
  },

  // Create systemInfo.
  create: function(createSystemInfo, callback) {
    SystemInfo.findUnique({$exists: true}, function(err, systemInfo) {
      if(err) {
        callback(err);
      } else if(systemInfo) {
        callback(new Error("Singleton System Info already exists."));
      } else {
        SystemInfo.create(createSystemInfo, function(err, systemInfo) {
          callback(err, systemInfo);
          if(systemInfo) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'SystemInfo', systemInfo));
        });
      }
    });
  },

  update: function(id, queryOptions, updateSystemInfo, callback) {
    if (typeof arguments[2] === 'function') callback = arguments[2];

    SystemInfo.findUnique(id, queryOptions, function(err, systemInfo) {
      if(err) callback(err);
      else {
        if(updateSystemInfo.version) systemInfo.version = updateSystemInfo.version;
        if(updateSystemInfo.isSeeded) systemInfo.isSeeded = updateSystemInfo.isSeeded;

        systemInfo.save(function(err) {
          callback(err, systemInfo);
          if(!err) eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'SystemInfo', systemInfo));
        });
      }
    });
  }
}
