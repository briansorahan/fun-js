
var http = require("http")
  , core = require("./core")
  , EventEmitter = require("events").EventEmitter;

    // aliases
    var instance      = fun.instance
      , compose       = fun.compose
      , isa           = fun.isa
      , Iface         = fun.Iface
      , Functor       = fun.Functor
      , Monad         = fun.Monad
      , Left          = fun.Left
      , Right         = fun.Right
    ;

    var Http = {
        Request:  Iface.parse("host port path method headers"),
        Response: Iface.parse("statusCode headers body")
    };

    // httpRequest :: Http.Request -> IO (Either Error Http.Response)
    fun.httpRequest = function(req) {
        function makeRequest(f) {
            var buflen = 0, buf = new Buffer(buflen);

            if (! isa(Http.Request, req)) {
                f(Left(new Error("httpRequest requires an Http.Request as the first argument")));
            } else {
                var encoding = "utf8"
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
                        f(Left(new Error("connection was ended")));
                    });

                    res.on("end", function() {
                        f(Right(Http.Response.instance({
                            statusCode:     function() { return res.statusCode; }
                          , headers:        function() { return res.headers; }
                          , body:           function() { return buf.toString(); }
                        })));
                    });
                });

                client.on("error", compose(f, Left));
                client.end();
            }
        }

        return instance( [Functor, Monad], {
            where: {
                fmap: function(f) { return makeRequest(f); }
              , unit: function(a) {}
              , bind: function(f) { return makeRequest(f); }
            }
        });
    };

    ex.Http = Http;
