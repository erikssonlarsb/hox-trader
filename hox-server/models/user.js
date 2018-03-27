var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Role = require('./role');

var userSchema = new Schema({
  name: String,
  role: {type: ObjectId, ref: 'Role', required: true},
  username: {type: String, required: true, unique: true, lowercase: true, trim: true},
  password: {type: String, required: true, select: false},
  email: {
    type: String,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'E-mail invalid.'],
    required: true,
    unique: true
  },
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

userSchema.pre('save', function(next) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
      if (err) {
        return next(err);
      } else {
        this.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function(candidatePassword, cb) {
  mongoose.model('User', userSchema).findOne({username: this.username}).select('password').exec(function (err, user) {
    if(err) {
      cb(err, null);
    } else {
      bcrypt.compare(candidatePassword, user.password, function(err, result) {
        if(err) {
          cb(err, null);
        } else {
          cb(null, result);
        }
      });
    }
  });
};

module.exports = mongoose.model('User', userSchema);
