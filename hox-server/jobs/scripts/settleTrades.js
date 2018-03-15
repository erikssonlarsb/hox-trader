var Trade = require('../../models/trade');
var Settlement = require('../../models/settlement');

exports.run = function() {
  console.log("### settleTrades started.");
  Trade.find({isSettled: false})
    .populate('counterpartyTrade')
    .populate({
      path: 'instrument',
      select: 'prices',
      populate: {
        path: 'prices',
        select: 'type value',
        match: { type: { $eq: 'SETTLEMENT'}}
      }
    })
    .exec(function(err, trades) {
      if(err) {
        console.log(err)
      } else {
        var settlements = {};

        // Filter out any trade in instrument that has no settlement price
        var unsettledTrades = trades.filter(trade => trade.instrument.prices[0]);
        for (let trade of unsettledTrades) {
          var tradeAmount = 0;
          if (trade.side == 'BUY') {
            tradeAmount = trade.quantity * (trade.instrument.prices[0].value - trade.price);
          } else {
            tradeAmount = trade.quantity * (trade.price - trade.instrument.prices[0].value);
          }
          if(settlements[trade.user] && settlements[trade.user][trade.counterpartyTrade.user]) {
            // Existing settlement between user and counterpartyTrade
            settlements[trade.user][trade.counterpartyTrade.user].trades.push(trade);
            settlements[trade.user][trade.counterpartyTrade.user].amount += tradeAmount;
          } else {
            if(!settlements[trade.user]) {
              settlements[trade.user] = {};
            }

            settlements[trade.user][trade.counterpartyTrade.user] = new Settlement({
              user: trade.user,
              trades: [trade],
              amount: tradeAmount
            });

            if(settlements[trade.counterpartyTrade.user] && settlements[trade.counterpartyTrade.user][trade.user]) {
              settlements[trade.user][trade.counterpartyTrade.user].counterpartySettlement = settlements[trade.counterpartyTrade.user][trade.user]._id;
              settlements[trade.counterpartyTrade.user][trade.user].counterpartySettlement = settlements[trade.user][trade.counterpartyTrade.user]._id;
            }
          }
        }

        for (let userSettlements of Object.values(settlements)) {
          for (let settlement of Object.values(userSettlements)) {
            if (settlement.amount == 0) {
              settlement.isAcknowledged = true;
            }
            settlement.save();

            for (let trade of settlement.trades) {
              trade.isSettled = true;
              trade.save();
              console.log("Settled trade: " + trade._id);
            }
          }
        }

        console.log("settleTrades finished. ###");
      }
    });
};
