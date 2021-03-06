// Require
var url, http;
url = require('url');
http = require('http');

var ImageFetcher = require('./lib/image_fetcher.js');

// Don't crash when an error occurs, instead log it
process.on('uncaughtException', function(err){
  console.log(err);
});

// Create our server
var server;
server = http.createServer(function(req,res){
  // Set caching
  res.setHeader('Access-Control-Max-Age', 5*60*1000);  // 5 minutes

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }

  // Get the params
  var query = url.parse(req.url,true).query;
  var imageUrl = query.url || null;
  var callback = query.callback || null;
  // check for param existance, error if not
  // if ( !imageUrl || !callback ) {
  if ( !imageUrl ) {
    console.log('Missing arguments');
    res.writeHead(400); // 400 = Bad Request
    res.end();
    return;
  }

  // request the image url
  var req = new ImageFetcher(imageUrl);
  req.getImage(function(err, contentType, statusCode, imageData) {
    var responseData, imageContentType;
    if ( !err && statusCode === 200 ) {
      console.log('Sent image:', imageUrl);
      res.setHeader('Content-Type', 'application/javascript');
      imageContentType = contentType;
      responseData = 'data:'+imageContentType+';base64,'+imageData;
      res.write(responseData);
      res.end();
      return;
    }
    else {
      console.log('Failed image:', imageUrl);
      res.writeHead(statusCode || 400); // bad request
      responseData = JSON.stringify('error:Application error');
      res.write(callback+'('+responseData+')');
      res.end();
      return;
    }
  });
});

// Start our server
server.listen(process.env.WEBSITEPORT || process.env.PORT || 18000, function() {
  var address = server.address();
  console.log("opened server on %j", address);
});

// Export
module.exports = server;
