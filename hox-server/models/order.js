var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var orderSchema = new Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  side: {type: String, enum: ['BUY', 'SELL'], required: true},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true},
  tradedQuantity: {type: Number},
  status: {type: String, enum: ['ACTIVE', 'WITHDRAWN', 'TRADED']},
  createTimestamp: Date,
  updateTimestamp: Date
});

orderSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
  next();
});

orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.tradedQuantity = 0;
  }
  next();
});

orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.status = 'ACTIVE';
  } else if (this.quantity == this.tradedQuantity) {
    this.status = 'TRADED';
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
