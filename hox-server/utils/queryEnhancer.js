
function queryEnhancer() {
  return function(req, res, next) {
    req.queryOptions = {
      'idField': req.query.$idField,
      'populate': req.query.$populate ? getPopulate(req.query.$populate) : undefined,
      'sort': req.query.$sort ? req.query.$sortOrder ? {[req.query.$sort] : req.query.$sortOrder} : req.query.$sort : undefined,
      'limit': req.query.$limit ? parseInt(req.query.$limit) : undefined
    }
    delete req.query.$idField;
    delete req.query.$populate;
    delete req.query.$sort;
    delete req.query.$sortOrder;
    delete req.query.$limit;
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
    if (!Array.isArray(populate)) populate = [populate];
    return populate.map(path => {
      if (typeof(path) === "string") return {path: path};  // Force paths to path map {path: path} in order for sanitizePopulate to work in factories
      else return path;
    });
  } catch (e) {
    return getPathsFromArray(populate.split(" "));
  }
}

module.exports = {
  queryEnhancer: queryEnhancer,
  getPopulate: getPopulate
}
