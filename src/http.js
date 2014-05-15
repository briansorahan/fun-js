/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex            = {}
  , http          = require("http")
  , core          = require("./core")
  , iface         = require("./iface")
  , types         = require("./types")
  , events        = require("./events")
  , either        = require("./either")
  , compose       = core.compose
  , isa           = iface.isa
  , instance      = iface.instance
  , Iface         = iface.Iface
  , Functor       = types.Functor
  , Monad         = types.Monad
  , Left          = either.Left
  , Right         = either.Right
  , Emitter       = events.Emitter
  , Async         = events.Async
  , signal        = events.signal
;

var Http = {
    Request:  Iface.parse("host port path method headers"),
    Response: Iface.parse("statusCode headers body")
};

// httpRequest :: Http.Request -> Event (Either Error Http.Response)
ex.httpRequest = function(req) {
    function makeRequest() {
        var emitter = Emitter();

        if (! isa(Http.Request, req)) {
            emitter.emit(Left(new Error("httpRequest requires an Http.Request as the first argument")));
        } else {
            var buflen = 0
              , buf = new Buffer(buflen)
              , encoding = "utf8"
              , reqopts = {
                  method: req.method() || "GET",
                  host: req.host() || "localhost",
                  port: req.port() || 80,
                  path: req.path() || "/",
                  headers: req.headers()
              };

            var client = http.request(reqopts, function(res) {
                res.setEncoding(encoding);

                res.on("data", function(str) {
                    var dataBuf = new Buffer(str);
                    buflen += dataBuf.length;
                    buf = Buffer.concat([ buf, dataBuf ], buflen);
                });

                res.on("close", function() {
                    emitter.emit(Left(new Error("connection was ended")));
                });

                res.on("end", function() {
                    console.log("emitting Right Http.Response");
                    emitter.emit(Right(Http.Response.instance({
                        statusCode:     function() { return res.statusCode; }
                      , headers:        function() { return res.headers; }
                      , body:           function() { return buf.toString(); }
                    })));
                });
            });

            client.on("error", compose(emitter.emit.bind(emitter), Left));
            client.end();
        }

        return emitter;
    }

    return Async(makeRequest());
};

ex.Http = Http;

Object.keys(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
