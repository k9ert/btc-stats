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

var methodReporterHash={};

for (var methodname in config.get('rpc')){
    methodReporterHash[methodname]={};
    methodReporterHash[methodname].resultDesc = config.get('rpc')[methodname];
    methodReporterHash[methodname].report = function () {
      var resultDesc=this.resultDesc;
      client[methodname](function(err, methodresult) {
        if (err) {
          return console.error(err);
        }

        if (util.isArray(methodresult)) {
          console.log("processing array");
          processArray(resultDesc,methodresult);
        } else {
          console.log("processing hash");
          processHash(resultDesc,methodresult);
        }

      });
    }
    methodReporterHash[methodname].report();
}



function processHash(resultdescHash, methodresult) {
  for (var resultkey in resultdescHash) {
    if (resultdescHash[resultkey]=="gauge") {
      var result = methodresult[resultkey]
      console.log("report " + resultkey + ":"+result);
      statsd.gauge(resultkey,result);
    }
  }
}

function processArray(resultdescHash, methodresult) {
  // go through the resultdescHash
  for (var resultkey in resultdescHash) {
    switch(resultdescHash[resultkey]) {
      case "sumgauge" :
        var sum = util.sum(methodresult,resultkey);
        console.log("report " + resultkey + ".sum :"+sum);
        statsd.gauge(resultkey + ".sum", sum);
        break
      case "avggauge" :
        var avg = util.avg(methodresult,resultkey);
        console.log("report " + resultkey + ".avg :"+avg);
        statsd.gauge(resultkey + ".avg",avg);
    }
  }
}

//process.exit();
