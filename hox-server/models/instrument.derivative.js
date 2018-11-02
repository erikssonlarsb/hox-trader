const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const DateOnly = require('mongoose-dateonly')(mongoose);
const Instrument = require('./instrument');
const Error = require('../utils/error');
mongoose.Promise = require('bluebird');

const derivativeSchema = new Schema({
  underlying: {type: ObjectId, ref: 'Instrument', required: true},
  expiry: {type: DateOnly, required: true}
});

derivativeSchema.pre('validate', function(next) {
  // Set dummy name to pass validation of required field.
  // Name will be set in pre-save hook later
  this.name = "Dummy";
  next();
});

derivativeSchema.pre('save', function(next) {
  let derivative = this;
  Instrument.findById(derivative.underlying, function(err, underlying) {
    if(err) {
      next(err);
    } else if (!underlying) {
      next(new Error("Underlying not found."));
    } else {
      derivative.name = underlying.name + " " +  derivative.expiry.toDate().toLocaleString('en', { month: 'short', year: '2-digit'});
      next();
    }
  });
});

module.exports = Instrument.discriminator('Derivative', derivativeSchema);
