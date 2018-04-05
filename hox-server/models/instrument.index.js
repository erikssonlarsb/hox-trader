const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Instrument = require('./instrument');

module.exports = Instrument.discriminator('Index', new Schema({
  isin: {type: String},
  ticker: {type: String}
}));
