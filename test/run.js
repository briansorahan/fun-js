var tests = [
    "./core-test.js"
  , "./list-test.js"
];

var t = require("tape");

tests.forEach(function(test) {
    require(test).run(t);
});
