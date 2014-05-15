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
  , deepEqual  = core.deepEqual
  , Iface      = iface.Iface
  , instance   = iface.instance
  , Eq         = types.Eq
  // , Functor    = types.Functor
  // , Monad      = types.Monad
;

var Pair = Iface.parse("eq/1 fst snd");

ex.Pair = function(a, b) {
    return instance([Eq], {
        where: {
            fst: function() { return a; }
          , snd: function() { return b; }
          , eq: function(p) {
              return deepEqual(p.fst(), a)
                  && deepEqual(p.snd(), b);
            }
        }
    });
};

//+ isPair :: _ -> Boolean
ex.isPair = function(x) { return Pair.check(x); };

//+ fst :: Pair a b -> a
ex.fst = function(a, b) {
    if (ex.isPair(a) && (typeof b === "undefined")) {
        return a.fst();
    } else {
        return a;
    }
};

//+ snd :: (a -> b -> c) -> a
ex.snd = function(a, b) {
    if (ex.isPair(a) && (typeof b === "undefined")) {
        return a.snd();
    } else {
        return b;
    }
};



Object.keys(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
