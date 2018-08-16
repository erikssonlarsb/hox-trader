/**
 * Plugin adds static method sanitizePopulate to schema, which queries the collection
 * and only returns the result if not finding more than 1 result that matches
 * the query parameters.
 */
const mongoose = require('mongoose');

module.exports = function(schema, options) {
 schema.statics.sanitizePopulate = function(populate) {
   return populate.map(path => {
     let populateSchema = mongoose.model(schema.obj[path.path].ref).schema;
     if(options.fields.includes(path.path)) {
       const publicFields = [];
       for (let field in populateSchema.obj) {
         if(populateSchema.obj[field].public) {
           publicFields.push(field)
         }
       }
       if(!path.select) {
         path.select = publicFields;
       } else {
         if(typeof(path.select) == 'string') {
           path.select = path.select.split(' ');
         }
         path.select = path.select.filter(field => publicFields.includes(field));
       }

       if(path.populate) {
         if(!Array.isArray(path.populate)) {
           path.populate = [path.populate];
         }
         path.populate = path.populate.filter(path => publicFields.includes(path.path));
       }
     }
     return path;
   });
 }
}
