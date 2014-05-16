/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
module.exports.run = function(test) {
    var fun           = require("../src")
      , util          = require("./util")
      , Emitter       = fun.Emitter
      , Async         = fun.Async
      , signal        = fun.signal
    ;

    test("Emitter", function(t) {
        t.plan(1);
        var val = 4;
        var e = Emitter(function(value) {
            t.equal(value, val,
                    t.name + " receives a value when it is emitted");
        });
        setTimeout(function() {
            e.emit(val);
        }, 10);
    });

    test("Async", function(t) {
        t.plan(2);
        var e = Emitter();
        // wrap e in an Async container
        var a = Async(e);
        var b = a.bind(function(value) {
            // do something with the value that
            // will asynchronously yield a result, then
            // emit the result
            var emitter = Emitter();
            setTimeout(function() {
                t.equal(value, 20);
                emitter.emit(6);
            }, 20);
            return emitter;
        }).fmap(function(value) {
            t.equal(value, 6,
                    t.name + " can chain handlers");
        });
        e.emit(20);
    });

    test("signal", function(t) {
        t.plan(1);
        var emitter = Emitter(function(val) {
            t.equal(val, 39,
                    t.name + " signals emitters with a value");
        });
        setTimeout(function() {
            signal(emitter, 39);
        }, 20);
    });
};