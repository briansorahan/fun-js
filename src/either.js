/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex         = {}
  , core       = require("./core")
  , iface      = require("./iface")
  , types      = require("./types")
  , instance   = iface.instance
  , Iface      = iface.Iface
  , Functor    = types.Functor
  , Monad      = types.Monad;



//+ data Either a b = Left a | Right b
var Either = Iface.parse("val isLeft fmap/1 unit/1 bind/1");

// Data constructors
ex.Left  = function(val) {
    return instance([ Functor, Monad ], {
        where: {
            val:    function()  { return val; },
            isLeft: function()  { return true; },
            unit:   function(a) { return ex.Left(a); },
            fmap:   function(f) { return self; },
            bind:   function(f) { return ex.Left(val); }
        }
    });
};

ex.Right = function(val) {
    return {
        val:    function()  { return val; },
        isLeft: function()  { return false; },
        fmap:   function(f) { return ex.Right(f(val)); },
        bind:   function(f) { return f(val); }
    };
};

//+ either :: (a -> c) -> (b -> c) -> Either a b -> c
ex.either = function(f, g, obj) {
    if ((! core.isFunction(f)) || (! core.isFunction(g)))
        throw new Error("either requires the first two arguments to be functions");

    return obj.isLeft() ? f(obj.val()) : g(obj.val());
}.autoCurry();

ex.lefts = function(array) {
    if (! core.isArray(array)) {
        return Either.Undefined;
    } else {
        return array.reduce(function(acc, el) {
            return el.isLeft() ? acc.concat(el.val()) : acc;
        }, []);
    }
};

ex.rights = function(array) {
    if (! core.isArray(array)) {
        return Either.Undefined;
    } else {
        return array.reduce(function(acc, el) {
            return el.isLeft() ? acc : acc.concat(el.val());
        }, []);
    }
};



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
