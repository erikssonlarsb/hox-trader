var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var priceSchema = new Schema({
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  type: {type: String, enum: ['LAST', 'CLOSE', 'SETTLEMENT'], required: true},
  date: {type: Date, required: true},
  value: {type: Number, required: true},
  createTimestamp: Date,
  updateTimestamp: Date
});

priceSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
  next();
});

module.exports = mongoose.model('Price', priceSchema);
