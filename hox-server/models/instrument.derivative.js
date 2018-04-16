const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const DateOnly = require('mongoose-dateonly')(mongoose);
const Instrument = require('./instrument');

module.exports = Instrument.discriminator('Derivative', new Schema({
    underlying: {type: ObjectId, ref: 'Instrument', required: true},
    expiry: {type: DateOnly, required: true}
  })
  .pre('validate', function(next) {
    let derivative = this;
    Instrument.findById(this.underlying, function(err, underlying) {
      if(err) {
        next(err);
      } else if (!underlying) {
        next(new Error("Underlying not found."));
      } else {
        derivative.name = underlying.name + " " +  derivative.expiry.toLocaleString('en', { month: 'short', year: '2-digit'});
        next();
      }
    })
}));
