
function queryEnhancer() {
  return function(req, res, next) {
    req.queryOptions = {
      'idField': req.query._idField,
      'populate': typeof(req.query._populate) === "string" ? [req.query._populate] : req.query._populate
    }
    delete req.query._idField;
    delete req.query._populate;
    next();
  }
}

module.exports = queryEnhancer;
