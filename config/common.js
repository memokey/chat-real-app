const makeHttpRequest = (options, postData, callback) => {
    return new Promise((resolve, reject) => {
      var http = require("https");
      var data = "";
      var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          data += chunk;
        });
        res.on('end', function () {
          try {
            data = JSON.parse(data);
            resolve(callback(null, data));
          } catch (e) {
            reject(callback(e, null));
          }
        });
      });
  
      req.on('error', function (e) {
        reject(callback(e, null));
      });
  
      if (postData != null) {
        req.write(postData);
      }
  
      req.end();
    })
  }

module.exports = {
    makeHttpRequest
}