var CronJob = require('cron').CronJob;
var Order = require('../../models/order');

exports.job = new CronJob('0 0 0 * * *', function() {
  console.log("### expireOrders started.");
  Order.find({status: 'ACTIVE'})
  .populate('instrument', 'expiry').exec(function (err, orders) {
    if(err) {
      console.log("Error finding order to expire: %s.", err);
    } else if(orders) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let order of orders) {
        if(order.instrument.expiry <= today) {
          order.status = 'EXPIRED';
          order.save();
          console.log("Expired order: " + order._id);
        }
      }
    }
    console.log("expireOrders finished. ###");
  });

}, null, true, 'Europe/London', null, true);
