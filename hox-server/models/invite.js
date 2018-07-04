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

inviteSchema.statics.sanitizePopulate = function (populate) {
  /*
  Restrict access to the User object referred to in path 'invitee'
   */
  return populate.map(path => {
    if(path.path == 'invitee') {
      return {
        path: 'invitee',
        select: 'name'
      };
    } else {
      return path;
    }
  });
}

inviteSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Invite', inviteSchema);
