var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Instrument = require('./instrument');

var orderSchema = new Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  side: {type: String, enum: ['BUY', 'SELL'], required: true},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true, min: 0, validate: {validator : function(v) {return v > 0;}}},
  tradedQuantity: {type: Number, min: 0, default: 0},
  status: {type: String, enum: ['ACTIVE', 'WITHDRAWN', 'TRADED', 'EXPIRED']},
  createTimestamp: Date,
  updateTimestamp: Date,
  modifyTimestamp: Date
});

orderSchema.pre('save', function(next) {
  Instrument.findById(this.instrument, function(err, instrument) {
    if (err) {
      next(err);
    } else if (instrument.expiry <= new Date()) {
      next(new Error('Cannot enter order on expired instrument.'));
    }  else {
      next();
    }
  });
});

orderSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
    this.modifyTimestamp = currentDate;
  }
  if (this.isModified('quantity') || this.isModified('price')) {
      this.modifyTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
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
