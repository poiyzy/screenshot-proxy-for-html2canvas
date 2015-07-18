var ImageFetcher;
var request = require('request');

ImageFetcher = (function() {
  function ImageFetcher (url) {
    this.url = url;
  }

  ImageFetcher.prototype.getImage = function (callback) {
    this.request(callback);
  }

  ImageFetcher.prototype.request = function (callback) {
    request({
      url: this.url,
      method: 'GET',
      encoding: 'base64',
      timeout: 60*1000
    },
    callback);
  }

  return ImageFetcher;

})();

module.exports = ImageFetcher;
