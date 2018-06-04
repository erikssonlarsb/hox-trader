const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Instrument = require('./instrument');
const Derivative = require('./instrument.derivative');

const indexSchema = new Schema({
  isin: {type: String},
  ticker: {type: String}
});

module.exports = Instrument.discriminator('Index', indexSchema);
