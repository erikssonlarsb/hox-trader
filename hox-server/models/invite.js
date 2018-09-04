const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const inviteSchema = new Schema({
  inviter: {type: ObjectId, ref: 'User', required: true},
  invitee: {type: ObjectId, ref: 'User'},
  code: {
    type: String,
    unique: true,
    set: function() {
      return crypto.randomBytes(8).toString('hex');  // Auto-generate random code.
    }}
});

inviteSchema.auth = {
  ownerField: 'inviter'
}

inviteSchema.plugin(require('./plugins/updateTimestamp'));
inviteSchema.plugin(require('./plugins/findUnique'));
inviteSchema.plugin(require('./plugins/authorizeFind'));

module.exports = mongoose.model('Invite', inviteSchema);
