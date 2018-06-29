const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DateOnly = require('mongoose-dateonly')(mongoose);
const ObjectId = Schema.Types.ObjectId;

const inviteSchema = new Schema({
  inviter: {type: ObjectId, ref: 'User', required: true},
  invitee: {type: ObjectId, ref: 'User'},
  code: {
    type: String,
    unique: true,
    set: function() {
      return crypto.randomBytes(8).toString('hex');  // Auto-generate random code.
    }},
  updateTimestamp: Date
});

require("../utils/findUnique")(inviteSchema);

inviteSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Invite', inviteSchema);
