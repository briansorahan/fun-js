/*
 * Playing with my http implementation.
 */
var fun           = require("../src")
  , Emitter       = fun.Emitter
  , httpRequest   = fun.httpRequest
  , either        = fun.either
  , instance      = fun.instance
  , Http          = fun.Http
  , Left          = fun.Left
  , Right         = fun.Right
  , isLeft        = fun.isLeft
;

// response logger
var logResponse = function(res) {
    console.log("Status:         " + res.statusCode());
    console.log("Headers:        " + JSON.stringify(res.headers()));
    console.log("Body Length:    " + res.body().length);
    return Right(res);
};

var logError = function(err) {
    console.error(err.message + "\n" + err.stack);
    return Left(err);
};

// the request
var req = Http.Request.instance({
    host:      function() { return "www.google.com"; }
  , port:      function() { return 80; }
  , path:      function() { return "/"; }
  , method:    function() { return "GET"; }
  , headers:   function() { return {}; }
});

// send it
// if we were going to perform another async action
// in the response handler function, then we would
// use bind instead of fmap
httpRequest(req).fmap(function(e) {
    return either(console.error, logResponse, e);
}).fmap(function(val) {
    if (val.isLeft()) {
        console.log("Error...");
    } else {
        console.log("Success!");
    }
});
