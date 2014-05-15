/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex          = {}
  , core        = require("./core")
  , iface       = require("./iface")
  , isDefined   = core.isDefined
  , isNull      = core.isNull
  , Iface       = iface.Iface
  , If          = core.If;

// data Maybe a = Nothing | Just a
var Maybe = ex.Maybe = Iface.parse("isNothing fmap/1 unit/1 bind/1");

var Nothing = ex.Nothing = Maybe.instance({
    isNothing: function()     { return true; },
    // instance Functor where
    fmap:      function(f)    { return Nothing; },
    // instance Monad where
    unit:      function(a)    { return Nothing; },
    bind:      function(f)    { return Nothing; }
});

// We map the javascript values undefined and null
// to Nothing.
var Just = ex.Just = function(val) {
    return Maybe.instance({
        val:       function()     { return val; },
        isNothing: function()     { return false; },
        // instance Functor where
        fmap:      function(f)    { return Just(f(val)); },
        // instance Monad where
        unit: function(a)    {
            return If(core.isDefined(a) && (! core.isNull(a)))
                .Then(Just(a))
                .Else(Nothing);
        },
        // HACK: don't expect client code to return a Maybe value,
        //       just wrap it for them
        bind:      function(f)    { return f(val); }
    });
};

Maybe.unit = function(a) {
    if (!isDefined(a) || isNull(a))
        return Nothing;
    else
        return Just(a);
};

//+ fromMaybe :: a -> Maybe a -> a
//! Takes a default value and a value wrapped in Maybe.
//  If the Maybe is Nothing it returns the default value.
//  If the Maybe is Just a, return a.
ex.fromMaybe = function(d, maybe) {
    return If(maybe.isNothing())
        .Then(d)
        .Else(maybe.val());
}.autoCurry();



Object.keys(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
