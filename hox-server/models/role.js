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
  permissions: {type: [permissionSchema], required: true}
});

roleSchema.plugin(require('./plugins/updateTimestamp'));

require("../utils/findUnique")(roleSchema);

module.exports = mongoose.model('Role', roleSchema);
