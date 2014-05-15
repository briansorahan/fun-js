/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex            = {}
  , core          = require("./core")
  , iface         = require("./iface")
  , types         = require("./types")
  , isArray       = core.isArray
  , isFunction    = core.isFunction
  , If            = core.If
  , isa           = iface.isa
  , Iface         = iface.Iface
  , instance      = iface.instance
  , Functor       = types.Functor
  , Monad         = types.Monad
;

/**
 * data Event a = Async a | Emitter a
 * Emitter emits a.
 * Async chains Emitter's.
 */
var Event = ex.Event = Iface.parse("emit/1 fmap/1 unit/1 bind/1");

ex.Emitter = function(f) {
    return Event.instance({
        emit: function(a) { if (isFunction(f)) f(a); }
      , unit: function(g) { return ex.Emitter(g); }
      , fmap: function(g) { return ex.Emitter(g(f)); }
      , bind: function(g) { return f = g; }
    });
};

/**
 * Wrapper around emitters that allows chaining with fmap and bind.
 * If you perform any async operations with the emitted result of
 * this async, then you should use bind and return an Emitter.
 * Otherwise use fmap.
 */
ex.Async = function(emitter) {
    if (! isa(Event, emitter))
        throw new Error("Async data constructor requires an Emitter");

    return Event.instance({
        emit: function(val) { return emitter.emit(val); }
      , unit: function(emitter) { return ex.Async(emitter); }
        /*
         * fmap returns an async that will catch the
         * emitted value from this async emitter, but with f applied first
         */
      , fmap: function(f) {
          var out = ex.Emitter();

          emitter.bind(function(val) {
              out.emit(f(val));
          });

          return ex.Async(out);
        }
        /*
         * bind returns an async that will emit
         * the value that is emitted from the emitter
         * returned by f
         */
      , bind: function(f) {
          var out = ex.Emitter();

          emitter.bind(function(val) {
              var innerEmitter = f(val);

              if (isa(Event, innerEmitter))
                  innerEmitter.bind(function(innerVal) {
                      out.emit(innerVal);
                  });
              else
                  throw new Error("Async bind function argument did not return Event");
          });

          return ex.Async(out);
        }
    });
};

// signal an Emitter with a value
ex.signal = function(emitter, val) {
    if (! isa(Event, emitter))
        throw new Error("on requires first argument to be an instance of Emitter");
    emitter.emit(val);
    return emitter;
}.autoCurry();



Object.keys(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
