/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
module.exports.run = function(test) {
    var fun           = require("../src")
      , util          = require("./util")
      , CaseMatch     = fun.CaseMatch
      , isNumber      = fun.isNumber
      , isString      = fun.isString
      , isArray       = fun.isArray
      , isFunction    = fun.isFunction
      , typeOf        = fun.typeOf
      , even          = fun.even
      , Iface         = fun.Iface
    ;

    test("CaseMatch", function(t) {
        t.plan(30);

        // number
        t.ok(CaseMatch(1, 1), "1 matches 1");
        t.notOk(CaseMatch(1, 2), "1 does not match 2");
        // string
        t.ok(CaseMatch("foo", "foo"), "\"foo\" matches \"foo\"");
        t.notOk(CaseMatch("foo", "bar"), "\"foo\" does not match \"bar\"");
        // boolean
        t.ok(CaseMatch(typeOf("boolean"), true),
             "true is a type of boolean");
        t.ok(CaseMatch(typeOf("boolean"), false),
             "false is a type of boolean");
        t.notOk(CaseMatch(typeOf("boolean"), "boolean"),
                "\"boolean\" is not a type of boolean");
        t.notOk(CaseMatch(typeOf("boolean"), null),
                "null is not a type of boolean");
        t.notOk(CaseMatch(typeOf("boolean"), undefined),
                "undefined is not a type of boolean");
        // object
        t.notOk(CaseMatch(typeOf("object"), undefined),
                "undefined is not a type of object");
        t.notOk(CaseMatch(typeOf("object"), null),
                "null is not a type of object");
        t.notOk(CaseMatch(typeOf("object"), function() {}),
                "a function is not a type of object");
        t.notOk(CaseMatch(typeOf("object"), [1,2,3]),
                "an array is not a type of object");
        t.notOk(CaseMatch(typeOf("object"), new Array([1,2,3])),
                "an array is not a type of object");
        t.ok(CaseMatch(typeOf("object"), { foo: "bar" }),
             "an anonymous object is a type of object");
        t.ok(CaseMatch(typeOf("object"), Object.create({ foo: "bar" })),
             "objects created with Object.create are a type of object");
        // array
        t.ok(CaseMatch([1,2,3], [1,2,3]),
             "matches arrays with deepEqual");
        t.ok(CaseMatch(isArray, [1,2,3]),
             "[1,2,3] is an array");
        t.notOk(CaseMatch(typeOf("string"), [1,2,3]),
                "[1,2,3] is not a type of string");
        t.notOk(CaseMatch(typeOf("object"), [1,2,3]),
                "[1,2,3] is not a type of object");
        // function
        t.ok(CaseMatch(isNumber, 3),
             "isNumber matches 3");
        t.notOk(CaseMatch(isNumber, Infinity),
                "isNumber does not match Infinity");
        t.ok(CaseMatch(isString, "foo"),
             "isString matches \"foo\"");
        t.notOk(CaseMatch(isString, String),
                "isString does not match \"String\"");
        t.ok(CaseMatch(isFunction, function() {}),
             "matches an anonymous function with isFunction");
        t.notOk(CaseMatch(isFunction, { foo : "bar" }),
                "{ foo: \"bar\" } is not a function");
        t.ok(CaseMatch(even, 8),
             "8 is even");
        t.notOk(CaseMatch(even, 9),
                "9 is not even");

        var Person = Iface({
            greets: function(guest) {},
            stops: function(evil) {}
        });

        // Iface
        var incomplete = {
            greets: function(guest) {}
        };
        var complete = {
            greets: function(guest) {},
            stops: function(evil) {}
        };

        t.notOk(CaseMatch(Person, incomplete),
                "returns false for an incomplete Iface implementation");
        t.ok(CaseMatch(Person, complete),
               "returns true for a complete Iface implementation");
    });
};