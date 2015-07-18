// __test__/image_fetcher_test.js

jest.dontMock('../lib/image_fetcher.js');

describe("ImageFetcher#getImage", function() {
  it("calls the request method", function() {
    var ImageFetcher = require('../lib/image_fetcher.js');

    var fetcher = new ImageFetcher('http://test.url');
    fetcher.getImage(callback);

    expect(callback).toBeCalledWith(["no error", {statusCode: 200}, "image data"]);
  });
});
