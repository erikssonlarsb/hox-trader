const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instrumentSchema = new Schema(
  {
    name: {type: String, unique: true, required: true},
    updateTimestamp: Date
  },
  {discriminatorKey: 'type'}
);

instrumentSchema.virtual('prices', {
  ref: 'Price',
  localField: '_id',
  foreignField: 'instrument'
});

instrumentSchema.set('toObject', { virtuals: true });

instrumentSchema.set('toJSON', { virtuals: true });

instrumentSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Instrument', instrumentSchema);
