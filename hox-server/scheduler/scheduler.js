module.exports.init = function() {
  var expireOrders = require('./jobs/expireOrders').job;
  var settleTrades = require('./jobs/settleTrades').job;  
  console.log("expireOrders next scheduled run: " + expireOrders.nextDates().toString());
  console.log("settleTrades next scheduled run: " + settleTrades.nextDates().toString());
};
