/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
module.exports.run = function(test) {
    var fun           = require("../src")
      , util          = require("./util")
      , Iface         = fun.Iface
      , instance      = fun.instance
      , isa           = fun.isa
      , isnota        = fun.isnota
      , Functor       = fun.Functor
      , Monad         = fun.Monad
      , s             = "foo/1 bar/2"
      , MyType        = Iface.parse(s)
    ;

    test("Iface", function(t) {
        t.plan(2);
        util.assertFunction(t, 1, Iface);
    });

    test("Iface.parse and Iface.toString", function(t) {
        t.plan(1);
        t.equal(MyType.toString(), s,
                t.name + " can parse/stringify Iface's");
    });

    test("Iface.check", function(t) {
        t.plan(2);

        var impl = {
            foo: function(a) {}
          , bar: function(a, b) {}
        };

        t.ok(MyType.check(impl),
             "passes objects that have a correct implementation");

        var bad = {
            foo: function(a, b) {}
          , bar: function(a) {}
        };
        
        t.notOk(MyType.check(bad),
                "returns false for objects that do not provide a correct impelementation");
    });

    test("Iface.instance", function(t) {
        t.plan(2);

        function bad() {
            return MyType.instance({
                foo: function(a, b) {}
              , bar: function(a) {}
            });
        }

        util.assertThrows(t, bad, "creating an instance with an incomplete/incorrect implementation");

        var impl = {
            foo: function(a) {}
          , bar: function(a, b) {}
        };

        t.equal(impl, MyType.instance(impl),
                "passes the object through if it's implementation checks");
    });

    test("instance", function(t) {
        t.plan(2);

        function bad() {
            return instance([Functor, Monad], {
                where: {
                    fmap: function(f, g) {}
                  , unit: function(a) {}
                  , bind: function(f) {}
                }
            });
        }

        util.assertThrows(t, bad, "when one of the Ifaces is not impelemented correctly");
        var impl = {
            fmap: function(f) {}
          , unit: function(a) {}
          , bind: function(f) {}
        };

        t.equal(impl, instance([Functor, Monad], { where: impl }),
                t.name + " passes the object through if it implements all the Ifaces correctly");
    });

    test("isa", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, isa);
        var isMyType = isa(MyType);
        util.assertCurriedFunction(t, 0, isMyType);
        var good = {
            foo: function(a) {},
            bar: function(a, b) {}
        };
        var bad = {
            foo: function(a, b) {},
            bar: function(a) {}
        };
        t.ok(isMyType(good),
             t.name + " passes objects that check");
        t.notOk(isMyType(bad),
                t.name + " fails objects that don't check");
    });

    test("isnota", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, isnota);
        var isNotMyType = isnota(MyType);
        util.assertCurriedFunction(t, 0, isNotMyType);
        var good = {
            foo: function(a) {},
            bar: function(a, b) {}
        };
        var bad = {
            foo: function(a, b) {},
            bar: function(a) {}
        };
        t.notOk(isNotMyType(good),
                t.name + " fails objects that check");
        t.ok(isNotMyType(bad),
                t.name + " passes objects that don't check");
    });
};
