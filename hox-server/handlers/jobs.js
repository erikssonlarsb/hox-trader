var fs = require('fs');
var express = require('express');
var router = express.Router();

/*
 *  Search the scripts folder and return all script names
 */
router.get('/', function(req, res) {
  var scripts = [];
  fs.readdirSync('./jobs/scripts/').forEach(function(fileName) {
    scripts.push(fileName.substring(0, fileName.indexOf('.js')));
  })
  res.json(scripts);
});

/*
 *  Run a script
 */
router.put('/:id/run', function(req, res) {
  try {
    require('../jobs/scripts/'+req.params.id).run();
    res.status(204).end();
  } catch (e) {
    res.status(500).json(e);
  }

});

module.exports = router