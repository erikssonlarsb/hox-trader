/**
 * Plugin adds pre-find middleware to sanitize populated documents from sensitive
 * data.
 * To work, add an auth property to the schema as per below example:
 *
 * userSchema.auth = {
 *   ownerField: '_id',
 *   publicFields: ['name', 'email', 'phone']
 * }
 *
 */
const mongoose = require('mongoose');
const Error = require('../../utils/error');

module.exports = function(schema) {

  schema.pre('find', function(next) {
    if(!this.options.isPopulate || !schema.auth.publicFields || schema.auth.publicFields.length <= 0) {
      // Schema has no public fields, filter out any unauthorized documents in query (if user is not admin)
      if(this.options['requester'] != 'admin') {
        if(schema.auth.ownerField in this.getQuery() && this.getQuery()[schema.auth.ownerField] != this.options['requester']) {
          // If query on owner, and query value is not same as requester; then force empty result.
          this.getQuery()['_id'] = {'$exists': false};
        } else {
          this.getQuery()[schema.auth.ownerField] = this.options['requester'];
        }
      }
    }
    next();
  });

  schema.post('find', function(documents, next) {
    if(this.options.isPopulate && schema.auth.publicFields && schema.auth.publicFields.length > 0) {
      // Schema has public fields. Sanitize documents from non-public fields,
      // if requestUser is not same as owner.
      const requester = this.options['requester'];
      documents.forEach(function(document, index) {
        let owner = document[schema.auth.ownerField];
        if (!owner) {
          throw new Error("No owner field. Cannot sanitize populate.");
        } else if (owner instanceof mongoose.Types.ObjectId) {
          owner = owner.toString();
        } else if (owner._id instanceof mongoose.Types.ObjectId) {
          owner = owner._id.toString();
        } else {
          throw new Error("Unknown owner.");
        }
        if(requester != owner && requester != 'admin') {
          // Requester is not owner, sanitize document.
          schema.eachPath(function(path) {
            if (!schema.auth.publicFields.includes(path) && path != '_id') {
              documents[index][path] = undefined;
            }
          });
        }
      });
    }
    next();
  });

  schema.set('toJSON', {
    // If an object (with public paths) has been sanitized from private details,
    // it will retain the required paths (set to null). To prettify the response,
    // all required paths set to null will be removed from the json.
    transform: function(doc, ret) {
      schema._requiredpaths.forEach(function(path) {
        if(ret[path] == null) {
          delete ret[path];
        }
      });
    }
  });
}
