const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tradeSchema = new Schema({
  order: {type: ObjectId, ref: 'Order', required: true},
  user: {type: ObjectId, ref: 'User', required: true},
  counterpartyTrade: {type: ObjectId, ref: 'Trade', required: true},
  instrument: {type: ObjectId, ref: 'Instrument', required: true},
  side: {type: String, enum: ['BUY', 'SELL'], required: true},
  price: {type: Number, required: true},
  quantity: {type: Number, required: true},
  isSettled: {type: Boolean, default: false},
  updateTimestamp: Date
});

require("../utils/findUnique")(tradeSchema);

tradeSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);
