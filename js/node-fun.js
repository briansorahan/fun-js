var http = require("http");

module.exports.augment = function(fun) {
    fun.Http = fun.Iface.parse("fmap/1 ret/1 bind/1");

    fun.Http.Request = fun.Iface.parse("host port path method headers");

    fun.Http.Response = fun.Iface.parse("statusCode headers body");

    // Http.request :: Http.Request -> Either Error Http.Response
    fun.Http.request = function(req) {
        if (! fun.isa(fun.Http.Request, req))
            throw new Error("Http.request requires an Http.Request");

        var reqopts = {
            method: req.method || "GET",
            host: req.host() || "localhost",
            port: req.port() || 80,
            path: req.path() || "/",
            headers: req.headers()
        };

        var client = http.request(reqopts, function(res) {
        });

        client.on("error", function(err) {
        });

        return fun.Http.instance({
            fmap: function(f) {},
            ret:  function(a) {},
            bind: function(f) {}
        });
    };
};
