var ex      = {}
  , core    = require("./core")
  , iface   = require("./iface")
  , Iface   = iface.Iface
  , If      = core.If;

function Emitter() {
    this._listeners = {};
}

Emitter.prototype.on = function(eventName, listener) {
    var self = this;
    self._listeners[eventName] = listener;
};

Emitter.prototype.emit = function(eventName) {
    var self = this,
        l = self._listeners[eventName],
        args = Array.prototype.slice.call(arguments, 1);
    if (core.isFunction(l)) {
        l.apply(self, args);
    }
};

ex.Emitter = Emitter;

ex.on = function(emitter, eventName, listener) {
    if (! core.instanceOf(Emitter, emitter))
        throw new Error("on requires first argument to be an instance of Emitter");
    emitter.on(eventName, listener);
    return emitter;
}.autoCurry();

ex.emit = function(emitter, eventName, value) {
    if (! core.instanceOf(Emitter, emitter))
        throw new Error("on requires first argument to be an instance of Emitter");
    var args = [eventName].concat(Array.prototype.slice.call(arguments, 2));
    emitter.emit.apply(emitter, args);
    return emitter;
}.autoCurry();

Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
