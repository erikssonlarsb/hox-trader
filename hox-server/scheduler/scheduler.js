module.exports.init = function() {
  var expireOrders = require('./jobs/expireOrders').job;
  var settleTrades = require('./jobs/settleTrades').job;
  var downloadPrices = require('./jobs/downloadPrices').job;
  console.log("expireOrders next scheduled run: " + expireOrders.nextDates().toString());
  console.log("settleTrades next scheduled run: " + settleTrades.nextDates().toString());
  console.log("downloadPrices next scheduled run: " + downloadPrices.nextDates().toString());
};
