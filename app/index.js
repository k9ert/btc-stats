
var bitcoin = require('./bitcoin.js');
var client = bitcoin.getClient();

var statsd = require('./statsd.js');
var statsdClient = statsd.getStatsdClient();

client.getBlockchainInfo(function(err, bci) {
  if (err) {
    return console.error(err);
  }
  statsd.gauge("blocks",bci.blocks);
  statsd.gauge("headers",bci.headers);
  statsd.gauge("difficulty",bci.difficulty);
  console.log(bci);
});
