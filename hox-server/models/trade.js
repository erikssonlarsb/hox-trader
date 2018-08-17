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
  field: 'user',
  public: ['user']
}

tradeSchema.plugin(require('./plugins/updateTimestamp'));
tradeSchema.plugin(require('./plugins/findUnique'));
//tradeSchema.plugin(require('./plugins/sanitizePopulate'), {fields: ['counterpartyTrade']});


tradeSchema.pre('find', function(next) {
  if(!this.getQuery()[tradeSchema.auth.field]) {
    // If not queried with authentication, only expose public fields
    this._fields = tradeSchema.auth.public;
  }
  next();
});

/*
tradeSchema.statics.sanitizePopulate = function(populate) {
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
*/

module.exports = mongoose.model('Trade', tradeSchema);
