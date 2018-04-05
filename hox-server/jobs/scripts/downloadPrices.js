var request=require('request');
var async=require('async');
var Instrument = require('../../models/instrument');
var Price = require('../../models/price');

var url = "http://www.nasdaqomxnordic.com/webproxy/DataFeedProxy.aspx?SubSystem=History&Action=GetChartData&json=true&timezone=${timezone}&FromDate=${fromDate}&Instrument=${isin}";

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
        var lastDate = new Date("1970-01-01");  // Start date to use if no prices has been downloaded already
        if (instrument.prices.length > 0) {
          lastDate = new Date(Math.max.apply(null, instrument.prices.map(function(price) {
            return price.date ? price.date : 0;
          })));
        }
        lastDate.setDate(lastDate.getDate() + 1);  //Add one day
        var fromDate = lastDate.toISOString().slice(0,10);
        var isin = instrument.isin;
        var timezone = 'CET';
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
                      date: new Date(historicPrice[0]),
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
                          if (new Date(historicPrice[0]) > existingPrice.date) {
                            existingPrice.value = historicPrice[1];
                            existingPrice.date = new Date(historicPrice[0]);
                            existingPrice.save();
                          }
                        } else {
                          var price = new Price({
                            instrument: instrument._id,
                            type: "LAST",
                            date: new Date(historicPrice[0]),
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
                            existingPrice.date = new Date(historicPrice[0]);
                            existingPrice.save();
                          }
                        } else {
                          var price = new Price({
                            instrument: instrument._id,
                            type: "HIGH",
                            date: new Date(historicPrice[0]),
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
                            existingPrice.date = new Date(historicPrice[0]);
                            existingPrice.save();
                          }
                        } else {
                          var price = new Price({
                            instrument: instrument._id,
                            type: "LOW",
                            date: new Date(historicPrice[0]),
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
