/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */

var ex = {} // object that gets merged into module.exports
  , core = require("./core");

//+ incr :: Integer -> Integer
ex.incr = function(x) {
    if (! core.isInteger(x))
        throw new Error("incr requires an Integer");
    return x + 1;
};

//+ decr :: Integer -> Integer
ex.decr = function(x) {
    if (! core.isInteger(x))
        throw new Error("decr requires an Integer");
    return x - 1;
};

//+ min :: [Number] -> Number
ex.min = function(ns) {
    if (! core.isArray(ns))
        throw new Error("min requires an Array");
    return Math.min.apply(null, ns);
};

//+ max :: [Number] -> Number
ex.max = function(ns) {
    if (! core.isArray(ns))
        throw new Error("max requires an Array");
    return Math.max.apply(null, ns);
};

//+ add :: Number -> Number -> Number
ex.add = function(x, y) { return x + y; }.autoCurry();

//+ multiply :: Number -> Number -> Number
ex.multiply = function(x, y) { return x * y; }.autoCurry();

//+ divide :: Number -> Number -> Number
ex.divide = function(dividend, divisor) { return dividend / divisor; }.autoCurry();

//+ pow :: Number ... -> Number
ex.pow = function(exponent, base) { return Math.pow(base, exponent); }.autoCurry();

//+ rem :: Number -> Number -> Number
//! computes remainder of m / n
ex.rem = function(m, n) {
    if (! (core.isInteger(m) && core.isInteger(n))) {
        throw new Error("rem expects integers");
    }
    return m < n ? m : (m == n ? 0 : m - (n * Math.floor(m / n)));
};

//+ even :: Integer -> Boolean
ex.even = function(n) {
    if (! core.isInteger(n))
        throw new Error("even requires an Integer");

    if (ex.rem(n, 2) == 0)
        return true;
    else
        return false;
};

//+ odd :: Integer -> Boolean
ex.odd = core.compose(core.not, ex.even);

//+ sum :: [Number] -> Number
ex.sum = function(ns) {
    if (! core.isArray(ns))
        throw new Error("sum requires an Array");

    return ns.reduce(function(acc, n) {
        if (! core.isNumber(n))
            throw new Error("sum requires an Array of Number's");
        return acc + n;
    }, 0);
};

//+ product :: [Number] -> Number
ex.product = function(ns) {
    if (! core.isArray(ns))
        throw new Error("product requires an Array");

    return ns.reduce(function(acc, n) {
        if (! core.isArray(ns))
            throw new Error("product requires an Array of Number's");
        return acc * n;
    }, 1);
};

//+ gt :: a -> a -> Boolean
ex.gt = function(x, y) { return x < y; }.autoCurry();

//+ gte :: a -> a -> Boolean
ex.gte = function(x, y) { return x <= y; }.autoCurry();

//+ lt :: a -> a -> Boolean
ex.lt = function(x, y) { return x > y; }.autoCurry();

//+ lte :: a -> a -> Boolean
ex.lte = function(x, y) { return x >= y; }.autoCurry();



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
