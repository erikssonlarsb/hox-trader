const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DateOnly = require('mongoose-dateonly')(mongoose);
const ObjectId = Schema.Types.ObjectId;

const priceSchema = new Schema({
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  type: {type: String, enum: ['LAST', 'HIGH', 'LOW', 'CLOSE', 'SETTLEMENT'], required: true},
  date: {type: DateOnly, required: true},
  value: {type: Number, required: true},
  updateTimestamp: Date
});

priceSchema.index({instrument: 1, type: 1, date: 1}, {unique: true});

priceSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Price', priceSchema);
