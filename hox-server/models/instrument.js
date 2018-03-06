var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Price = require('./price');

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

const derivatives = ["FORWARD"];

var instrumentSchema = new Schema({
  name: {type: String, unique: true, required: function() {
    return derivatives.indexOf(this.type) <= -1;
  }},
  type: {type: String, enum: ['INDEX', 'FORWARD'], required: true},
  isin: {type: String},
  ticker: {type: String},
  underlying: {type: ObjectId, ref: 'Instrument', required: function() {
    return derivatives.indexOf(this.type) > -1;
  }},
  expiry: {type: Date, required: function() {
    return derivatives.indexOf(this.type) > -1;
  }},
  createTimestamp: Date,
  updateTimestamp: Date
});

instrumentSchema.virtual('prices', {
  ref: 'Price',
  localField: '_id',
  foreignField: 'instrument'
});

instrumentSchema.set('toObject', { virtuals: true });
instrumentSchema.set('toJSON', { virtuals: true });

instrumentSchema.pre('save', function(next) {
  if(derivatives.indexOf(this.type) <= -1) {
    this.expiry = null;
    this.underlying = null;
  }
  next();
});

instrumentSchema.pre('save', function(next) {
  var instrument = this;  // Save reference to instrument object
  if(derivatives.indexOf(this.type) > -1) {
    mongoose.model('Instrument', instrumentSchema)
    .findById(this.underlying, function(err, underlying) {
      if (err) {
        next(err);
      } else {
        var year = instrument.expiry.getFullYear();
        var month = monthNames[instrument.expiry.getMonth()];
        instrument.name = underlying.name + " " + month + " " + year;
        next();
      }
    });
  } else {
    next();
  }
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
