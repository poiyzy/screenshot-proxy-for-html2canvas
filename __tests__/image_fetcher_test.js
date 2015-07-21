// __test__/image_fetcher_test.js

jest.dontMock('../lib/image_fetcher.js');

describe("ImageFetcher#getImage", function() {
  it("calls the request method", function() {
    var ImageFetcher = require('../lib/image_fetcher.js');
    var request = require('request');

    var fetcher = new ImageFetcher('http://test.url');
     var callback = jest.genMockFunction();
    fetcher.getImage(callback);

    expect(request).toBeCalledWith({
      url: 'http://test.url',
      method: 'GET',
      encoding: 'base64',
      timepit: 60*1000
    }, callback);
      // ["no error", {statusCode: 200}, "image data"]);
  });
});
