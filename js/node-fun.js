var http = require("http");
var EventEmitter = require("events").EventEmitter;

module.exports.augment = function(fun) {
    fun.Http = {
        Request:  fun.Iface.parse("host port path method headers"),
        Response: fun.Iface.parse("statusCode headers body")
    };

    // httpRequest :: Http.Request -> IO (Either Error Http.Response)
    fun.httpRequest = function(req) {
        function makeRequest(ev) {
            var buflen = 0, buf = new Buffer(buflen);
            
            if (! fun.isa(fun.Http.Request, req)) {
                ev.emit("error", new Error("httpRequest requires an Http.Request as the first argument"));
            } else {
                var reqopts = {
                    method: req.method || "GET",
                    host: req.host() || "localhost",
                    port: req.port() || 80,
                    path: req.path() || "/",
                    headers: req.headers()
                };

                var client = http.request(reqopts, function(res) {
                    // trigger error or response
                    res.setEncoding("utf8");
                    res.on("data", function(dataBuf) {
                        buflen += dataBuf.length;
                        buf = Buffer.concat([ buf, dataBuf ], buflen);
                    });
                    res.on("close", function() {
                        ev.emit("error", new Error("connection was ended"));
                    });
                    res.on("end", function() {
                        ev.emit("response", fun.Http.Response.instance({
                            
                        }));
                    });
                });

                client.on("error", ev.emit("error"));
            }
        }

        return fun.IO.instance({
            fmap: function(f) {
                var ev  = new EventEmitter();
                makeRequest(ev);
                ev.on("error",    fun.compose(fun.IO, f, fun.Left));
                ev.on("response", fun.compose(fun.IO, f, fun.Right));
            },
            unit: function(a) {
            },
            bind: function(f) {
                var ev  = new EventEmitter();
                makeRequest(ev);
                ev.on("error",    fun.compose(f, fun.Left));
                ev.on("response", fun.compose(f, fun.Right));
            }
        });
    };
};
