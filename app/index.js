var config = require('config');
var util = require('./util.js');
var bitcoin = require('./bitcoin.js');
var client = bitcoin.getClient();

var statsd = require('./statsd.js');
var statsdClient = statsd.getStatsdClient();

client.getPeerInfo(function(err, bci) {
  if (err) {
    return console.error(err);
  }
  //statsd.gauge("blocks",bci.blocks);
  //statsd.gauge("headers",bci.headers);
  //statsd.gauge("difficulty",bci.difficulty);
  //console.log(bci);

});



for (var methodname in config.get('rpc')){
    var resultdesc = config.get('rpc')[methodname];
    console.log("processing " + methodname );
    console.log(resultdesc);
    client[methodname](function(err, methodresult) {
      console.log("the resultdesc is:");
      console.log(resultdesc);
      if (err) {
        return console.error(err);
      }

      if (util.isArray(methodresult)) {
        console.log("processing array");
        console.log(resultdesc);
        processArray(resultdesc,methodresult);
      } else {
        console.log("processing hash");
        console.log(resultdesc);
        processHash(resultdesc,methodresult);
      }

    });
}



function processHash(resultdescHash, methodresult) {
  console.log( resultdescHash);
  for (var resultkey in resultdescHash) {
    if (resultdescHash[resultkey]=="gauge") {
      console.log("process " + resultkey);
      statsd.gauge(resultkey,methodresult[resultkey]);
    }
  }
}

function processArray(resultdescHash, methodresult) {
  // go through the resultdescHash
  for (var resultkey in resultdescHash) {
    switch(resultdesc[resultkey]) {
      case "sumgauge" :
        var sum = util.sum(methodresult,resultkey);
        statsd.gauge(resultkey,sum);
        break
      case "avggauge" :
        var avg = util.avg(methodresult,resultkey);
        statsd.gauge(resultkey,avg);
    }
  }
}

//process.exit();
