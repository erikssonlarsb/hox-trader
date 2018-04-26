const request = require('request');
const async = require('async');
const DateOnly = require('dateonly');
const Instrument = require('../../models/instrument');
const Price = require('../../models/price');

const url = "http://www.nasdaqomxnordic.com/webproxy/DataFeedProxy.aspx?SubSystem=History&Action=GetChartData&json=true&timezone=CET&FromDate=${fromDate}&Instrument=${isin}";

exports.run = function() {
  console.log("### downloadPrices started.");
  Instrument.find({type: 'Index'})
  .populate({
    path: 'prices',
    match: { type: { $eq: 'CLOSE'}}
  })
  .exec(function (err, instruments) {
    if(err) {
      console.log("Error finding instruments for price download: %s.", err);
    } else if(instruments) {
      for (let instrument of instruments) {
        let fromDate = new DateOnly(19700001);  // Start date to use if no prices has been downloaded already
        if (instrument.prices.length > 0) {
          fromDate = new DateOnly(Math.max.apply(null, instrument.prices.map(function(price) {
            return price.date ? price.date + 1 : 0;  // Add one day, to search from day after exisiting
          })));
        }

        fromDate = fromDate.toISOString();
        var isin = instrument.isin;
        request(eval('`'+url+'`'), function (error, response, body) {
          if(error) {
            console.log("Error downloading prices: ", error);
          } else {
            var jsonBody = JSON.parse(body);
            if(jsonBody.exception) {
              console.error(jsonBody.exception['@msg']);
            } else {
              var historicPrices = jsonBody.data[0].chartData.cp;
              if (historicPrices) {
                async.eachSeries(historicPrices,
                  function(historicPrice, callback) {
                    var price = new Price({
                      instrument: instrument._id,
                      type: 'CLOSE',
                      date: new DateOnly(historicPrice[0]),
                      value: historicPrice[1]
                    });
                    price.save(function(err) {
                      if (err) {
                        console.log(err);
                      }
                    })
                    .then(function() {
                      return Price.findOne(
                        {
                          instrument: instrument._id,
                          type: "LAST"
                        }, function (err, existingPrice) {
                        if (err) {
                          console.log(err);
                        } else if (existingPrice) {
                          if (new DateOnly(historicPrice[0]) > existingPrice.date) {
                            existingPrice.value = historicPrice[1];
                            existingPrice.date = new DateOnly(historicPrice[0]);
                            existingPrice.save();
                          }
                        } else {
                          var price = new Price({
                            instrument: instrument._id,
                            type: "LAST",
                            date: new DateOnly(historicPrice[0]),
                            value: historicPrice[1]
                          });
                          price.save();
                        }
                      })
                    })
                    .then(function() {
                      return Price.findOne(
                        {
                          instrument: instrument._id,
                          type: "HIGH"
                        }, function (err, existingPrice) {
                        if (err) {
                          console.log(err);
                        } else if (existingPrice) {
                          if (historicPrice[1] > existingPrice.value) {
                            existingPrice.value = historicPrice[1];
                            existingPrice.date = new DateOnly(historicPrice[0]);
                            existingPrice.save();
                          }
                        } else {
                          var price = new Price({
                            instrument: instrument._id,
                            type: "HIGH",
                            date: new DateOnly(historicPrice[0]),
                            value: historicPrice[1]
                          });
                          price.save();
                        }
                      })
                    })
                    .then(function() {
                      return Price.findOne(
                        {
                          instrument: instrument._id,
                          type: "LOW"
                        }, function (err, existingPrice) {
                        if (err) {
                          console.log(err);
                        } else if (existingPrice) {
                          if (historicPrice[1] < existingPrice.value) {
                            existingPrice.value = historicPrice[1];
                            existingPrice.date = new DateOnly(historicPrice[0]);
                            existingPrice.save();
                          }
                        } else {
                          var price = new Price({
                            instrument: instrument._id,
                            type: "LOW",
                            date: new DateOnly(historicPrice[0]),
                            value: historicPrice[1]
                          });
                          price.save();
                        }
                      })
                    })
                    .then(function() {
                      callback();
                    })
                    .catch(function(error) {
                      console.log(error);
                      callback();
                    });
                  }
                )
              }
            }
          }
        });
      }
    }
    console.log("downloadPrices finished. ###");
  });
};
