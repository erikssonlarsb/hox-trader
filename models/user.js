var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  createTimestamp: Date,
  updateTimestamp: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updateTimestamp = currentDate;
  if (!this.createTimestamp) {
    this.createTimestamp = currentDate;
  }
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
