var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var instrumentSchema = new Schema({
  name: {type: String, unique: true},
  underlying: {type: String, required: true},
  expiry: {type: Date, required: true},
  createTimestamp: Date,
  updateTimestamp: Date
});

instrumentSchema.pre('save', function(next) {
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

  var year = this.expiry.getFullYear();
  var month = monthNames[this.expiry.getMonth()];
  this.name = this.underlying + month + year
  next();
});

instrumentSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
  next();
});

module.exports = mongoose.model('Instrument', instrumentSchema);
