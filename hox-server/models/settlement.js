const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const settlementSchema = new Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  counterpartySettlement: {type: ObjectId, ref: 'Settlement', required: true},
  trades: [{type: ObjectId, ref: 'Trade', required: true}],
  isAcknowledged: {type: Boolean, default: false},
  amount: {type: Number, default: 0},
  updateTimestamp: Date
});

require("../utils/findUnique")(settlementSchema);

settlementSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Settlement', settlementSchema);
