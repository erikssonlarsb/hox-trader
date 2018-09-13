const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const systemInfoSchema = new Schema({
  version: {type: String, required: true},
  isSeeded: {type: Boolean, default: false},
  inviteOnly: {type: Boolean, default: false}
}, {
  collection: 'systeminfo'  // Singular name since collection is singleton.
});

systemInfoSchema.plugin(require('./plugins/updateTimestamp'));
systemInfoSchema.plugin(require('./plugins/findUnique'));

module.exports = mongoose.model('SystemInfo', systemInfoSchema);
