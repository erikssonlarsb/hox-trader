const Error = require('../utils/error');

module.exports = function(Schema) {
  Schema.statics.findUnique = function (query, populate, callback) {
    if (typeof populate === 'function') {
      callback = populate;
      populate = '';
    }
    this.find(query)
    .limit(2) // Only one should be found, if 2, id is not unique.
    .populate(populate) // Populate any fields in the populate option.
    .exec(function(err, documents) {
      if(err || documents.length > 1) {
        callback(err || new Error({code: 422, message: "Non-unique identifier."}));
      } else {
        callback(err, documents[0]);
      }
    });
  }
}
