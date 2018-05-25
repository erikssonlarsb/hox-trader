const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Instrument = require('./instrument');
const Derivative = require('./instrument.derivative');

const indexSchema = new Schema({
  isin: {type: String},
  ticker: {type: String}
});

indexSchema.virtual('derivatives', {
  ref: 'Derivative',
  localField: '_id',
  foreignField: 'underlying'
})

module.exports = Instrument.discriminator('Index', indexSchema);
