const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  _id : false,
  resource: {type: String, required: true},
  methods: {type: [String], enum: ['GET', 'POST', 'PUT', 'DELETE'], required: true}
});

const roleSchema = new Schema({
  name: {type: String, required: true, unique: true},
  isAdmin: Boolean,
  permissions: {type: [permissionSchema], required: true},
  updateTimestamp: Date
});

require("../utils/findUnique")(roleSchema);

roleSchema.pre('save', function(next) {
  this.updateTimestamp = new Date();
  next();
});

module.exports = mongoose.model('Role', roleSchema);
