/**
 * Plugin adds field updateTimestamp to schema, and updates the field
 * before saving schema.
 */
module.exports = function(schema, options) {
  schema.add({ updateTimestamp: Date });

  schema.pre('save', function (next) {
    this.updateTimestamp = new Date();
    next();
  });

  if (options && options.index) {
    schema.path('updateTimestamp').index(options.index);
  }
}
