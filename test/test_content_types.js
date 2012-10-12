const
vows = require('vows'),
assert = require('assert'),
request = require('request'),
server = require('../server');

var port = 0;

vows.describe("Content Types")

.addBatch({
  "Test server": {
    topic: function() {
      var cb = this.callback;
      server.listen(0, function() {
        port = server.address().port;
        cb(null, port);
      });
    },

    "running": function(port) {
      assert(port !== 0);
    }
  }
})

.addBatch({
  "manifest": {
    topic: function() {
      var cb = this.callback;
      request.get("http://localhost:"+port+"/manifest.webapp", function(req, res, body) {
        cb(null, res, body);
      });
    },

    "is application/x-web-app-manifest+json": function(err, res, body) {
      assert(res.headers['content-type'] === "application/x-web-app-manifest+json");
    },

    "is valid JSON": function(err, res, body) {
      var manifest = JSON.parse(body);
      assert(typeof manifest.name !== 'undefined');
    }
  }
})

.export(module);