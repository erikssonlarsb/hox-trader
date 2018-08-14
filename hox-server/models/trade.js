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

tradeSchema.plugin(require('./plugins/updateTimestamp'));

require("../utils/findUnique")(tradeSchema);

tradeSchema.statics.sanitizePopulate = function(populate) {
  /*
  Restrict access to the Trade object referred to in path 'counterpartyTrade'
   */
  return populate.map(path => {
    if(path.path == 'counterpartyTrade') {
      return {
        path: 'counterpartyTrade',
        select: 'user',
        populate: {path: 'user', select: 'name email phone'}
      };
    } else {
      return path;
    }
  });
}

module.exports = mongoose.model('Trade', tradeSchema);
