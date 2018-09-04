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
  isSettled: {type: Boolean, default: false}
});

tradeSchema.auth = {
  ownerField: 'user',
  publicFields: ['user']
}

tradeSchema.plugin(require('./plugins/updateTimestamp'));
tradeSchema.plugin(require('./plugins/findUnique'));
tradeSchema.plugin(require('./plugins/authorizeFind'));

module.exports = mongoose.model('Trade', tradeSchema);
