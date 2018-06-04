const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instrumentSchema = new Schema({
    name: {type: String, unique: true, required: true},
    status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    updateTimestamp: Date
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

instrumentSchema.set('toObject', { virtuals: true });

instrumentSchema.set('toJSON', { virtuals: true });

instrumentSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Instrument', instrumentSchema);
