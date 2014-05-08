/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex      = {}
  , iface   = require("./iface")
  , Iface   = iface.Iface;

//+ class Functor f where
//+ fmap :: (a -> b) -> f a -> f b
ex.Functor = Iface.parse("fmap/1");

//+ class Monad m where
//+ ret  :: a -> m a
//+ bind :: m a -> (a -> m b) -> m b
ex.Monad = Iface.parse("unit/1 bind/1");

Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
