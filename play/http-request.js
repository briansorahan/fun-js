var fun = require("../src");

// aliases
var httpRequest = fun.httpRequest
  , either      = fun.either
  , instance    = fun.instance
  , Http        = fun.Http
  , req         = Http.Request.instance({
      host:      function() { return "www.google.com"; }
    , port:      function() { return 80; }
    , path:      function() { return "/"; }
    , method:    function() { return "DELETE"; }
    , headers:   function() { return {}; }
  })
;

// response logger
var logResponse = function(res) {
    console.log("Status:  " + res.statusCode());
    console.log("Headers: " + JSON.stringify(res.headers()));
    console.log("Body:    " + res.body());
};

// make the request
httpRequest(req).bind(function(e) {
    either(console.error, logResponse, e);
});
