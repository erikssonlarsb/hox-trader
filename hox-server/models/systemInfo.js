const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemInfoSchema = new Schema({
  version: {type: String, required: true},
  isSeeded: {type: Boolean, default: false},
  updateTimestamp: Date
}, {
  collection: 'systeminfo'  // Singular name since collection is singleton.
});

systemInfoSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('SystemInfo', systemInfoSchema);
