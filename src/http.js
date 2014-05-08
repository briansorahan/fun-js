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
  , isa           = core.isa
  , instance      = iface.instance
  , Iface         = iface.Iface
  , Functor       = types.Functor
  , Monad         = types.Monad
  , Left          = either.Left
  , Right         = either.Right
  , Emitter       = events.Emitter
  , Send          = events.Send
  , signal        = events.signal
;

var Http = {
    Request:  Iface.parse("host port path method headers"),
    Response: Iface.parse("statusCode headers body")
};

// httpRequest :: Http.Request -> Event (Either Error Http.Response)
ex.httpRequest = function(req) {
    function RequestWith(emitter) {
        if (! isa(Http.Request, req)) {
            emitter.emit(Left(new Error("httpRequest requires an Http.Request as the first argument")));
        } else {
            var buflen = 0
              , buf = new Buffer(buflen)
              , encoding = "utf8"
              , emit = signal(emitter)
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
                    emitter.emit( Right( Http.Response.instance({
                        statusCode:     function() { return res.statusCode; }
                      , headers:        function() { return res.headers; }
                      , body:           function() { return buf.toString(); }
                    })));
                });
            });

            client.on("error", compose(emit(emitter), Left));
            client.end();
        }

        return Event.instance({
            fmap: function(f) {
                emitter.fmap(f);
            }
            , unit: function(a) {}
            , bind: function(f) {
                return RequestWith(f);
            }
        });
    }

    return Event.instance({
        fmap: function(f) {
            return RequestWith(Emitter(f));
        }
        , unit: function(a) {}
        , bind: function(f) {
            return RequestWith(f);
        }
    });
};

ex.Http = Http;

/*
 * Chaining Event values...
 * httpRequest(reqInstance).bind(function(e) {
 *     // queryDb :: Http.Response -> Event (Either Error Db.QueryResult)
 *     function queryDb(res) {
 *         return Event.instance
 *     }
 * 
 *     // e :: Either Error Http.Response
 *     return e.bind(queryDb);
 * });
 */