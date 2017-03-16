var config = require('config');

var statsdClient = null;

exports.getStatsdClient = function() {
  var StatsD = require('node-statsd');
  var client = new StatsD(
        {
          host: config.get('statsd.host'),
          prefix: config.get('statsd.prefix'),
          cacheDns:true
      }
  );

  client.socket.on('error', function(error) {
        return console.error("Error in socket: ", error);
  });
  statsdClient = client
  return client;
}

exports.gauge = function(key,value) {
  statsdClient.gauge(key,value, function(error, bytes){
    //this only gets called once after all messages have been sent
    if(error){
      console.error('Oh noes! There was an error:', error);
    } else {
      console.log('Successfully sent', bytes, 'bytes');
    }
  });
}
