var http = require("http");
var EventEmitter = require("events").EventEmitter;

module.exports.augment = function(fun) {
    fun.Http = fun.Iface.parse("fmap/1 unit/1 bind/1");

    fun.Http.Request = fun.Iface.parse("host port path method headers");

    fun.Http.Response = fun.Iface.parse("statusCode headers body");

    // httpRequest :: Http.Request -> Promise Either Error Http.Response
    fun.httpRequest = function(req) {
        if (! fun.isa(fun.Http.Request, req))
            throw new Error("Http.request requires an Http.Request");

        var ev = new EventEmitter();

        var reqopts = {
            method: req.method || "GET",
            host: req.host() || "localhost",
            port: req.port() || 80,
            path: req.path() || "/",
            headers: req.headers()
        };

        var client = http.request(reqopts, function(res) {
            // trigger error or response
        });

        client.on("error", function(err) {
            // trigger error
        });

        return fun.Http.instance({
            fmap: function(f) {},
            unit:  function(a) {},
            bind: function(f) {
                ev.on("error",    fun.compose(f, fun.Left));
                ev.on("response", fun.compose(f, fun.Right));
            }
        });
    };
};
