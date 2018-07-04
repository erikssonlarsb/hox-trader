/*
systemInfoFactory handles database interaction for the systemInfo collection.
Since systemInfo is a singleton (only one document in collection),
handling differs somewhat from normal procedure.
*/
const SystemInfo = require('../models/systemInfo');
const eventEmitter = require('../events/eventEmitter');
const DocumentEvent = require('../events/event.document');

module.exports = {

  // Find the systemInfo document (if created).
  findOne: function(params, {populate = []}, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    SystemInfo.findUnique(params, function(err, systemInfo) {
      callback(err, systemInfo);
    });
  },

  // Upsert systemInfo
  create: function(createSystemInfo, callback) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    SystemInfo.findUnique({}, function(err, systemInfo) {
      if(err) {
        callback(err);
      } else if(!systemInfo) {
        SystemInfo.create(createSystemInfo, function(err, systemInfo) {
          callback(err, systemInfo);
          if(systemInfo) eventEmitter.emit('DocumentEvent', new DocumentEvent('Create', 'SystemInfo', systemInfo));
        });
      } else {
        if(createSystemInfo.version) systemInfo.version = createSystemInfo.version;
        if(createSystemInfo.isSeeded) systemInfo.isSeeded = createSystemInfo.isSeeded;

        systemInfo.save(function(err) {
          callback(err, systemInfo);
          if(!err) eventEmitter.emit('DocumentEvent', new DocumentEvent('Update', 'SystemInfo', systemInfo));
        });
      }
    });
  }
}
