const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DateOnly = require('mongoose-dateonly')(mongoose);
const ObjectId = Schema.Types.ObjectId;
mongoose.Promise = require('bluebird');

const priceSchema = new Schema({
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  type: {type: String, enum: ['LAST', 'HIGH', 'LOW', 'CLOSE', 'SETTLEMENT'], required: true},
  date: {type: DateOnly, required: true},
  value: {type: Number, required: true}
});

priceSchema.index({instrument: 1, type: 1, date: 1}, {unique: true});

priceSchema.plugin(require('./plugins/updateTimestamp'));
priceSchema.plugin(require('./plugins/findUnique'));

module.exports = mongoose.model('Price', priceSchema);
