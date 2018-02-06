module.exports.init = function() {
  var expireOrders = require('./jobs/expireOrders').job
  console.log("expire orders next scheduled run: " + expireOrders.nextDates().toString());
};
