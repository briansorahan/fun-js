/*
 * Playing with my http implementation.
 */
var fun           = require("../src")
  , Emitter       = fun.Emitter
  , httpRequest   = fun.httpRequest
  , either        = fun.either
  , instance      = fun.instance
  , Http          = fun.Http
  , req           = Http.Request.instance({
      host:      function() { return "www.google.com"; }
    , port:      function() { return 80; }
    , path:      function() { return "/"; }
    , method:    function() { return "GET"; }
    , headers:   function() { return {}; }
  })
;

// response logger
var logResponse = function(res) {
    console.log("Status:         " + res.statusCode());
    console.log("Headers:        " + JSON.stringify(res.headers()));
    console.log("Body Length:    " + res.body().length);
};

// make the request
httpRequest(req).bind(function(e) {
    either(console.error, logResponse, e);
    return Emitter(function(val) {
        console.log("inner received " + JSON.stringify(val));
    });
});
