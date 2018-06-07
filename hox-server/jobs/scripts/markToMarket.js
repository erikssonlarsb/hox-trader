/*
markToMarket saves Last price as Closing price in order to create
a price history for each instrument.
 */

const instrumentFactory = require('../../factories/instrumentFactory');
const priceFactory = require('../../factories/priceFactory');
const Price = require('../../models/price');

exports.run = function() {
  console.log("### markToMarket started.");

  instrumentFactory.query({type: 'Derivative'}, {populate: ['prices']}, function(err, instruments) {
    if(err) {
      console.error("Error finding derivatives for MtM: %s.", err);
    } else {
      for(let instrument of instruments) {
        const lastPrice = instrument.prices.find(price => price.type == 'LAST');
        if(lastPrice) {
          const existingClosing = instrument.prices.filter(price => price.type == 'CLOSE' && price.date.valueOf() == lastPrice.date.valueOf());
          if(existingClosing.length > 0) {
            continue;  // CLOSE already exists for this date.
          } else {
            const closingPrice = new Price({
              instrument: instrument._id,
              type: 'CLOSE',
              value: lastPrice.value,
              date: lastPrice.date
            });
            priceFactory.create(closingPrice, function(err, price) {
              if(err) {
                console.error("Error saving CLOSE: " + err);
              }
            });
          }
        }
      }
      console.log("### markToMarket finished.");
    }
  });
}
