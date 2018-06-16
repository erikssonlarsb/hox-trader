
function queryEnhancer() {
  return function(req, res, next) {
    req.queryOptions = {
      'idField': req.query._idField,
      'populate': typeof(req.query._populate) === "string" ? [req.query._populate] : req.query._populate,
      'sort': req.query._sort ? req.query._sortOrder ? {[req.query._sort] : req.query._sortOrder} : req.query._sort : undefined,
      'limit': req.query._limit ? parseInt(req.query._limit) : undefined
    }
    delete req.query._idField;
    delete req.query._populate;
    delete req.query._sort;
    delete req.query._sortOrder;
    delete req.query._limit;
    next();
  }
}

module.exports = queryEnhancer;
