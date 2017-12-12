var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permissionSchema = new Schema({
  _id : false,
  resource: {type: String, required: true},
  methods: {type: [String], enum: ['GET', 'POST', 'PUT', 'DELETE'], required: true}
});

var roleSchema = new Schema({
  name: {type: String, required: true, unique: true},
  permissions: {type: [permissionSchema], required: true},
  createTimestamp: Date,
  updateTimestamp: Date
});

roleSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (this.isNew) {
    this.createTimestamp = currentDate;
  }
  this.updateTimestamp = currentDate;
  next();
});

module.exports = mongoose.model('Role', roleSchema);
