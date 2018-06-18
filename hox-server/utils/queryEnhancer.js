
function queryEnhancer() {
  return function(req, res, next) {
    req.queryOptions = {
      'idField': req.query._idField,
      'populate': req.query._populate ? getPopulate(req.query._populate) : undefined,
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

function getPathsFromArray(pathArray) {
  let paths = [];
  for (let path of pathArray) {
    paths.push({path: path});
  }
  return paths;
}

function getPopulate(populate) {
  try {
    populate = JSON.parse(populate);
    if (Array.isArray(populate)) {
      return populate;
    } else {
      return [populate];
    }
  } catch (e) {
    if (typeof(populate) === "string") {
      return getPathsFromArray(populate.split(" "));
    } else {
      return getPathsFromArray(populate);
    }
  }
}

module.exports = queryEnhancer;
