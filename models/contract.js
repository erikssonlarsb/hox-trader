var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var contractSchema = new Schema({
  name: {type: String, unique: true},
  underlying: {type: String, required: true},
  expiry: {type: Date, required: true},
  createTimestamp: Date,
  updateTimestamp: Date
});

contractSchema.pre('save', function(next) {
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

  var year = this.expiry.getFullYear();
  var month = monthNames[this.expiry.getMonth()];
  this.name = this.underlying + month + year
  next();
});

contractSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updateTimestamp = currentDate;
  if (!this.createTimestamp) {
    this.createTimestamp = currentDate;
  }
  next();
});

module.exports = mongoose.model('Contract', contractSchema);
