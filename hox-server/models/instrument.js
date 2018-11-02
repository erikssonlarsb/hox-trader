const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const instrumentSchema = new Schema({
    name: {type: String, unique: true, required: true},
    status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true}
  },
  {discriminatorKey: 'type'}
);

instrumentSchema.virtual('prices', {
  ref: 'Price',
  localField: '_id',
  foreignField: 'instrument'
});

instrumentSchema.virtual('derivatives', {
  ref: 'Derivative',
  localField: '_id',
  foreignField: 'underlying'
});

instrumentSchema.plugin(require('./plugins/updateTimestamp'));
instrumentSchema.plugin(require('./plugins/findUnique'));

instrumentSchema.set('toObject', { virtuals: true });
instrumentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Instrument', instrumentSchema);
