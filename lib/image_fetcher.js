var request = require('request');
var fs = require('fs');
var urlParser = require('url');
var path = require('path');
var mkdirp = require('mkdirp');
var mime = require('mime-types');

var ImageFetcher;

ImageFetcher = (function() {
  function ImageFetcher (url) {
    this.url = url;
    this.mime = mime;
    this.parsedUrl = urlParser.parse(url);
    this.pwd = this.parsedUrl.path;
    this.host = this.parsedUrl.host;
    this.filePath = path.parse(this.pwd);
  }

  ImageFetcher.prototype.getImage = function (callback) {
    fs.readFile("cached_images/" + this.host + this.pwd, 'base64', function(err,data){
      if (!err){
        console.log('read from cache: ' + this.host + this.pwd);
        var contentType = mime.lookup("cached_images/" + this.host + this.pwd);
        callback(null, contentType, 200, data);
      }else{
        console.log("will download image from " + this.host + this.pwd);
        this.request(callback);
      }
    }.bind(this));
  }

  ImageFetcher.prototype.cacheImage = function (data) {
    mkdirp("cached_images/" + this.host + this.filePath.dir, function (err) {
      if (!err) {
        console.log("mkdir: " + "cached_images" + this.filePath.dir);
      }
    }.bind(this));

    fs.writeFile("cached_images/" + this.host + this.pwd, data, 'base64', function (err) {
      console.log(err);
    }.bind(this));
  }

  ImageFetcher.prototype.request = function (callback) {
    request({
      url: this.url,
      method: 'GET',
      encoding: 'base64',
      timeout: 60*1000
    }, function (err, imageRes, imageData) {
      this.cacheImage(imageData);

      var contentType = imageRes.headers['content-type'];
      if (imageRes) {
        var statusCode = imageRes.statusCode;
      } else {
        err = "no res";
      }

      callback(err, contentType, statusCode, imageData);
    }.bind(this));
  }

  return ImageFetcher;

})();

module.exports = ImageFetcher;
