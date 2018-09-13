const mongoose = require('mongoose');
const deasync = require('deasync');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Role = require('./role');
mongoose.Promise = require('bluebird');

const userSchema = new Schema({
  name: {type: String},
  role: {type: ObjectId, ref: 'Role', required: true, set: getReferenceId},
  username: {type: String, required: true, unique: true, lowercase: true, trim: true},
  password: {type: String, required: true, select: false},
  email: {
    type: String,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'E-mail invalid.'],
    required: true,
    unique: true
  },
  phone: {type: String, required: true}
});

userSchema.auth = {
  ownerField: '_id',
  publicFields: ['name', 'email', 'phone']
}

userSchema.plugin(require('./plugins/updateTimestamp'));
userSchema.plugin(require('./plugins/findUnique'));
userSchema.plugin(require('./plugins/authorizeFind'));

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

/* Function used to get the ObjectId of referenced objects defined in the
 * mongoose Schema. If identifier is an object, the key-value-pairs will
 * be used to query the reference model for an unique object whose ObjectId
 * will be returned.
 *
 * Dynamic referencing is handy when you know a logical identifier
 * (e.g. instrument name, or role name), and want to avoid an
 * additional query only to find the ObjectId.
 */
function getReferenceId(identifier, field) {
  if (!identifier || typeof(identifier) === "string") {
     // Identifier is ObjectId
     return identifier;
  } else {
    // Identifier is query.
    let referee;
    let done = false;

    mongoose.model(field.options.ref).find(identifier, function(err, result) {
      referee = result;
      done = true;
    });

    deasync.loopWhile(() => {
      return !done;
    });

    if(referee.length == 1) {
      return referee[0]._id;
    } else {
      return null;
    }
  }
}

module.exports = mongoose.model('User', userSchema);
