var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var orderSchema = new Schema({
  user: {type: ObjectId, required: true},
  instrument: {type: ObjectId, required: true},
  side: {type: String, enum: ['Buy', 'Sell'], required: true},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true},
  createTimestamp: Date,
  updateTimestamp: Date
});

orderSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updateTimestamp = currentDate;
  if (!this.createTimestamp) {
    this.createTimestamp = currentDate;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
