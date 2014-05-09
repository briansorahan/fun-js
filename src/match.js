/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex      = {}
  , core    = require("./core")
  , list    = require("./list")
  , math    = require("./math")
  , iface   = require("./iface")
  , Iface   = iface.Iface;

/*
 * Pattern matching according to the following rules:
 * For Iface match with isa.
 * For String match type-wise or with Regexp or identical.
 * For Number use identical.
 * For Array and Object use instanceof, then strictDeepEqual.
 * For Infinity, null, undefined use identical.
 */
var CaseMatch = ex.CaseMatch = function(pattern, val) {
    if (pattern instanceof Iface) {
        return core.isa(pattern, val);
    } else if (core.isFunction(pattern)) {
        return pattern(val);
    } else if (core.isRegexp(pattern) && core.isString(val)) {
        return pattern.test(val);
    } else if (core.isArray(val) && pattern !== Array) {
        return core.strictDeepEqual(pattern, val);
    } else if (core.isObject(pattern) && pattern !== Object) {
        return core.strictDeepEqual(pattern, val);
    } else if (core.isInfinity(val)) {
        return core.isInfinity(pattern);
    } else {
        return (typeof val === pattern)
            || (core.isFunction(pattern) && (val instanceof pattern))
            || val === pattern
            || val == pattern;
    }
};

ex.Otherwise = {};

/*
 * see
 * http://stackoverflow.com/questions/203739/why-does-instanceof-return-false-for-some-literals
 * for a good description of some of the things you need to be careful of
 * when trying to match using instanceOf
 */
var Match = ex.Match = function() {
    var args = Array.prototype.slice.call(arguments),
        nargs = args.length;

    if (! math.even(nargs))
        throw new Error("all patterns in a Match must have a corresponding expression");
    // else
    //     console.log(nargs);

    function TestCase(val, patterns) {
        var pattern = patterns[0], expr = patterns[1];

        if (pattern === ex.Otherwise || ex.CaseMatch(pattern, val)) {
            return expr;
        } else if (patterns.length < 2) {
            return ex.Match.Fail;
        } else {
            return TestCase(val, list.drop(2, patterns));
        }
    }

    return function(val) {
        return nargs < 2 ? ex.Match.Fail : TestCase(val, args);
    };
};

ex.Match.Fail = {};



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
