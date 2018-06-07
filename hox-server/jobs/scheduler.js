var CronJob = require('cron').CronJob;

module.exports.init = function() {
  /*
  var downloadPrices = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: require('./scripts/downloadPrices').run,
    start: true,
    timeZone: 'UTC',
    runOnInit: false
  });

  var expireInstruments = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: require('./scripts/expireInstruments').run,
    start: true,
    timeZone: 'UTC',
    runOnInit: false
  });

  var settleTrades = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: require('./scripts/settleTrades').run,
    start: true,
    timeZone: 'UTC',
    runOnInit: false
  });

  console.log("Download Prices: next scheduled run: " + downloadPrices.nextDates().toString());
  console.log("Expire Instruments: next scheduled run: " + expireInstruments.nextDates().toString());
  console.log("Settle Trades: next scheduled run: " + settleTrades.nextDates().toString());
  */

};
