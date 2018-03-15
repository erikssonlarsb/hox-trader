var CronJob = require('cron').CronJob;

module.exports.init = function() {

  var downloadPrices = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: require('./scripts/downloadPrices').run,
    start: true,
    timeZone: 'Europe/London',
    runOnInit: false
  });

  var expireOrders = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: require('./scripts/expireOrders').run,
    start: true,
    timeZone: 'Europe/London',
    runOnInit: false
  });

  var settleTrades = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: require('./scripts/settleTrades').run,
    start: true,
    timeZone: 'Europe/London',
    runOnInit: false
  });

  console.log("Download Prices: next scheduled run: " + downloadPrices.nextDates().toString());
  console.log("Expire Orders: next scheduled run: " + expireOrders.nextDates().toString());
  console.log("Settle Trades: next scheduled run: " + settleTrades.nextDates().toString());

};
