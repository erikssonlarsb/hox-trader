var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Role = require('./role');

var userSchema = new Schema({
  name: String,
  role: {type: ObjectId, ref: 'Role', required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true, select: false},
  email: {type: String, required: true, unique: true},
  phone: {type: String, required: true},
  createTimestamp: Date,
  updateTimestamp: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
  next();
});

userSchema.methods.verifyPassword = function(candidatePassword, cb) {
  mongoose.model('User', userSchema).findOne({username: this.username}).select('password').exec(function (err, user) {
    if(err) {
      cb(err, null);
    } else {
      cb(null, user.password == candidatePassword);
    }
  });
};

module.exports = mongoose.model('User', userSchema);
