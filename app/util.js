
exports.sum = function(myarray, key) {
  var arrayLength = myarray.length;
  var sum = 0;
  for (var i = 0; i < arrayLength; i++) {
    sum += myarray[i][key];
  }
  return sum;
}

exports.avg = function(myarray, key) {
  var arrayLength = myarray.length;
  var sum = 0;
  for (var i = 0; i < arrayLength; i++) {
    sum += myarray[i][key];
  }
  return sum/arrayLength;
}

exports.isArray = function(what) {
  return Object.prototype.toString.call(what) === '[object Array]';
}
