/**
 * Plugin addes field updateTimestamp to schema, and updates the field
 * before saving schema.
 *
 * @param  {Schema} schema  The schema to which the plugin is utilized.
 * @param  {Dict} options Any options that should be applied.
 */

module.exports = function updateTimestampPlugin(schema, options) {
  schema.add({ updateTimestamp: Date });

  schema.pre('save', function (next) {
    this.updateTimestamp = new Date();
    next();
  });

  if (options && options.index) {
    schema.path('updateTimestamp').index(options.index);
  }
}
