var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var settlementSchema = new Schema({
  user: {type: ObjectId, ref: 'User', required: true},
  counterpartySettlement: {type: ObjectId, ref: 'Settlement', required: true},
  trades: [{type: ObjectId, ref: 'Trade', required: true}],
  isAcknowledged: {type: Boolean, default: false},
  amount: {type: Number, default: 0},
  createTimestamp: Date,
  updateTimestamp: Date
});

settlementSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
  next();
});

module.exports = mongoose.model('Settlement', settlementSchema);
