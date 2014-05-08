/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex          = {}
  , events      = require("events").EventEmitter
  , core        = require("./core")
  , iface       = require("./iface")
  , types       = require("./types")
  , isFunction  = core.isFunction
  , Iface       = iface.Iface
  , instance    = iface.instance
  , Functor     = types.Functor
  , Monad       = types.Monad
  , If          = core.If
;

// emit a value to a listener eventually
function Emitter(listener) {
    if (! core.isFunction(listener))
        throw new Error("Emitter constructor requires a listener function");
    this._listener = listener;
}

Emitter.prototype.emit = function(val) {
    var l = this._listener;
    l.apply(l, val);
    return this;
};

Emitter.prototype.fmap = function(listener) {
    return new Emitter(listener);
};

Emitter.prototype.bind = function(listener) {
    this._listener = listener;
    return this;
};

ex.Emitter = function(l) { return new Emitter(l); };

// data Event a = Send a | Receive a
var Event = ex.Event = Iface.parse("fmap/1 unit/1 bind/1");

var Send = ex.Send = function(val) {
    return Event.instance({
        //+ (a -> b) -> Event a -> Event b
        fmap: function(f) {
            return new Emitter(f(val));
        },
        unit: function(a) {
        },
        //+ Event a -> (a -> Event b) -> Event b
        bind: function(f) {
        }
    });
};

ex.signal = function(emitter, val) {
    if (! core.instanceOf(Emitter, emitter))
        throw new Error("on requires first argument to be an instance of Emitter");
    emitter.emit(val);
    return emitter;
}.autoCurry();

/*
 * Chainable events.
 * 
 */
Event.chain = function(e) {
};

Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
