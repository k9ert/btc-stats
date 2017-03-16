var config = require('config');

exports.getClient = function() {
  var bitcoin = require('bitcoin');
  return new bitcoin.Client({
    host: 'localhost', 
    port: 8332,
    user: config.get('bitcoin.user'),
    pass: config.get('bitcoin.password')
  });

}
