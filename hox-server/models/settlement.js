const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const settlementSchema = new Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  counterpartySettlement: {type: ObjectId, ref: 'Settlement', required: true},
  trades: [{type: ObjectId, ref: 'Trade', required: true}],
  isAcknowledged: {type: Boolean, default: false},
  amount: {type: Number, default: 0}
});

settlementSchema.plugin(require('./plugins/updateTimestamp'));
settlementSchema.plugin(require('./plugins/findUnique'));

settlementSchema.statics.sanitizePopulate = function(populate) {
  /*
  Restrict access to the Settlement object referred to in path 'counterpartySettlement'
   */
  return populate.map(path => {
    if(path.path == 'counterpartySettlement') {
      return {
        path: 'counterpartySettlement',
        select: 'user isAcknowledged',
        populate: {path: 'user', select: 'name email phone'}
      };
    } else {
      return path;
    }
  });
}

module.exports = mongoose.model('Settlement', settlementSchema);
