const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Instrument = require('./instrument');

const orderSchema = new Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  side: {type: String, enum: ['BUY', 'SELL'], required: true},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true, min: 0, validate: {validator : function(v) {return v > 0;}}},
  tradedQuantity: {type: Number, min: 0, default: 0},
  status: {type: String, enum: ['ACTIVE', 'WITHDRAWN', 'TRADED', 'EXPIRED']},
  updateTimestamp: Date
});

orderSchema.pre('save', function(next) {
  if(this.status != 'EXPIRED') {
    Instrument.findById(this.instrument, function(err, instrument) {
      if (err) {
        next(err);
      } else if (!instrument) {
        next(new Error('Instrument not found.'));
      } else if (instrument.status == 'INACTIVE') {
        next(new Error('Cannot enter/modify order on inactive instrument.'));
      }  else {
        next();
      }
    });
  } else {
    next();
  }
});

orderSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
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
