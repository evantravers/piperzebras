(function() {
  var Instafeed, chai, should;

  chai = require('chai');

  chai.should();

  should = chai.should();

  Instafeed = require('../src/instafeed').Instafeed;

  describe('Instafeed instace', function() {
    var document, feed;
    feed = null;
    document = 'test';
    it('should inherit defaults if nothing is passed', function() {
      feed = new Instafeed;
      feed.options.target.should.equal('instafeed');
      return feed.options.resolution.should.equal('thumbnail');
    });
    it('should accept multiple options as an object', function() {
      feed = new Instafeed({
        target: 'mydiv',
        clientId: 'mysecretid'
      });
      feed.options.target.should.equal('mydiv');
      feed.options.clientId.should.equal('mysecretid');
      return feed.options.resolution.should.equal('thumbnail');
    });
    it('should accept context as a parameter', function() {
      var context;
      context = {};
      feed = new Instafeed({}, context);
      return feed.context.should.equal(context);
    });
    it('should know if there are next results to load', function() {
      feed = new Instafeed;
      (feed.hasNext()).should.be["false"];
      feed.nextUrl = "teststring";
      return (feed.hasNext()).should.be["true"];
    });
    it('should have a unique timestamp when instantiated', function() {
      feed = new Instafeed;
      return feed.unique.should.exist;
    });
    it('should refuse to run without a client id or access token', function() {
      feed = new Instafeed;
      return (function() {
        return feed.run();
      }).should["throw"]("Missing clientId or accessToken.");
    });
    it('should refuse to parse NON-JSON data', function() {
      return (function() {
        return feed.parse('non-object');
      }).should["throw"]('Invalid JSON response');
    });
    it('should detect an API error', function() {
      return (function() {
        return feed.parse({
          meta: {
            code: 400,
            error_message: 'badbad'
          }
        });
      }).should["throw"]('Error from Instagram: badbad');
    });
    it('should detect when no images are returned from the API', function() {
      return (function() {
        return feed.parse({
          meta: {
            code: 200
          },
          data: []
        });
      }).should["throw"]('No images were returned from Instagram');
    });
    it('should assemble a url using the client id', function() {
      feed = new Instafeed({
        clientId: 'test'
      });
      return feed._buildUrl().should.equal("https://api.instagram.com/v1/media/popular?client_id=test&callback=instafeedCache" + feed.unique + ".parse");
    });
    it('should use the access token for authentication, when available', function() {
      feed = new Instafeed({
        clientId: 'test',
        accessToken: 'mytoken'
      });
      return feed._buildUrl().should.equal("https://api.instagram.com/v1/media/popular?access_token=mytoken&callback=instafeedCache" + feed.unique + ".parse");
    });
    it('should refuse to build a url with invalid "get" option', function() {
      feed = new Instafeed({
        clientId: 'test',
        get: 'casper'
      });
      return (function() {
        return feed._buildUrl();
      }).should["throw"]("Invalid option for get: 'casper'.");
    });
    it('should refuse to build a url if get=tag and there is no tag name', function() {
      feed = new Instafeed({
        clientId: 'test',
        get: 'tagged'
      });
      return (function() {
        return feed._buildUrl();
      }).should["throw"]("No tag name specified. Use the 'tagName' option.");
    });
    it('should refuse to build a url if get=location and there is no location id set', function() {
      feed = new Instafeed({
        clientId: 'test',
        get: 'location'
      });
      return (function() {
        return feed._buildUrl();
      }).should["throw"]("No location specified. Use the 'locationId' option.");
    });
    it('should refuse to build a url if get=user and there is no userId', function() {
      feed = new Instafeed({
        clientId: 'test',
        get: 'user',
        accessToken: 'mytoken'
      });
      return (function() {
        return feed._buildUrl();
      }).should["throw"]("No user specified. Use the 'userId' option.");
    });
    it('should refuse to build a url if get=user and there is no accessToken', function() {
      feed = new Instafeed({
        clientId: 'test',
        get: 'user',
        userId: 1
      });
      return (function() {
        return feed._buildUrl();
      }).should["throw"]("No access token. Use the 'accessToken' option.");
    });
    it('should run a before & after callback functions', function() {
      var callback, timesRan;
      timesRan = 0;
      callback = function() {
        return timesRan++;
      };
      feed = new Instafeed({
        clientId: 'test',
        before: callback,
        after: callback
      });
      feed.run();
      timesRan.should.equal(1);
      feed.parse({
        meta: {
          code: 200
        },
        data: [1, 2, 3]
      });
      return timesRan.should.equal(2);
    });
    it('should run a success callback with json data', function() {
      var callback, numImages;
      numImages = 0;
      callback = function(json) {
        return numImages = json.data.length;
      };
      feed = new Instafeed({
        clientId: 'test',
        success: callback
      });
      feed.parse({
        meta: {
          code: 200
        },
        data: [1, 2, 3]
      });
      return numImages.should.equal(3);
    });
    it('should run the error callback if problem with json data', function() {
      var callback, message;
      message = '';
      callback = function(problem) {
        return message = problem;
      };
      feed = new Instafeed({
        clientId: 'test',
        error: callback
      });
      feed.parse(3);
      message.should.equal('Invalid JSON data');
      feed.parse({
        meta: {
          code: 200
        },
        data: []
      });
      message.should.equal('No images were returned from Instagram');
      feed.parse({
        meta: {
          code: 400,
          error_message: 'bad data'
        },
        data: [2]
      });
      return message.should.equal('bad data');
    });
    it('should parse an html template (including nested properties)', function() {
      var data, template;
      feed = new Instafeed;
      template = '<div>{{custom}} - {{nested[0].target}} {hard code}</div>';
      data = {
        custom: 'test data',
        nested: [
          {
            target: 4
          }
        ]
      };
      feed._makeTemplate('{{doesntexist}}', {}).should.equal("");
      return feed._makeTemplate(template, data).should.equal('<div>test data - 4 {hard code}</div>');
    });
    it('should be able to access a nested object property by a string', function() {
      var test;
      feed = new Instafeed;
      test = {
        toplevel: {
          first: 2,
          lowerlevel: {
            property: 'test'
          }
        },
        empty: null
      };
      should.equal(feed._getObjectProperty(test, 'toplevel.doesntexist.somekey'), null);
      should.equal(feed._getObjectProperty(null, 'anything.someothing'), null);
      should.equal(feed._getObjectProperty(test, 'empty.key1'), null);
      feed._getObjectProperty(test, 'toplevel[first]').should.equal(2);
      return feed._getObjectProperty(test, 'toplevel.lowerlevel.property').should.equal('test');
    });
    it('should be able to sort data by a property', function() {
      var image1, image2, image3, testdata;
      feed = new Instafeed;
      image1 = {
        name: "image1",
        meta: {
          likes: {
            count: 21
          },
          comments: 14
        }
      };
      image2 = {
        name: "image2",
        meta: {
          likes: {
            count: 1
          },
          comments: 25
        }
      };
      image3 = {
        name: "image3",
        meta: {
          likes: {
            count: 22
          },
          comments: 1
        }
      };
      testdata = [image1, image2, image3];
      feed._sortBy(testdata, 'meta.likes.count', false).should.deep.equal([image3, image1, image2]);
      feed._sortBy(testdata, 'meta.likes.count', true).should.deep.equal([image2, image1, image3]);
      return feed._sortBy(testdata, 'meta.comments', false).should.deep.equal([image2, image1, image3]);
    });
    return it('should be able to filter data with a callback', function() {
      var filterFunc, image1, image2, image3, testdata;
      feed = new Instafeed;
      filterFunc = function(image) {
        return image.name === "image1";
      };
      image1 = {
        name: "image1"
      };
      image2 = {
        name: "image2"
      };
      image3 = {
        name: "image3"
      };
      testdata = [image1, image2, image3];
      return feed._filter(testdata, filterFunc).should.deep.equal([image1]);
    });
  });

}).call(this);
