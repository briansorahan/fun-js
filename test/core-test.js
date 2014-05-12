// -*- mode: js2; -*-
module.exports.run = function(test) {
    var fun = require("../src")
    // aliases
      , id = fun.id
      , isNull = fun.isNull
      , isDefined = fun.isDefined
      , isArray = fun.isArray
      , isString = fun.isString
      , isFunction = fun.isFunction
      , isInfinity = fun.isInfinity
      , isObject = fun.isObject
      , isNumber = fun.isNumber
      , isInteger = fun.isInteger
      , isRegexp = fun.isRegexp
      , arg = fun.arg
      , If = fun.If
      , curry = fun.curry
      , autoCurry = fun.autoCurry
      , compose = fun.compose
      , composer = fun.composer
      , flip = fun.flip
      , until = fun.until
      , equal = fun.equal
      , identical = fun.identical
      , deepEqual = fun.deepEqual
      , strictDeepEqual = fun.strictDeepEqual
      , and = fun.and
      , or = fun.or
      , not = fun.not
      , pluck = fun.pluck
      , dot = fun.dot
      , has = fun.has
      , instanceOf = fun.instanceOf
      , typeOf = fun.typeOf
      , objMap = fun.objMap
      , keys = fun.keys
      , vals = fun.vals
      , merge = fun.merge
      , reduceOwn = fun.reduceOwn
      , filterOwn = fun.filterOwn
      , util = require("./util")
    ;
    // tape module
    // , test = require("tape");

    function greet(name) {
        return "Hi, " + name;
    }

    function capitalize(word) {
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }

    test("id", function(t) {
        t.plan(3);
        util.assertFunction(t, 1, id);
        t.equal(id(1, 2), 1, t.name + " only returns the first argument");
    });

    test("isNull", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, isNull);
        t.ok(isNull(null), t.name + " returns true for null");
        t.notOk(isNull(undefined)
                && isNull(2)
                && isNull("foo")
                && isNull([])
                && isNull({})
                && isNull(function(){})
                && isNull(false)
                , t.name + " returns false for everything else");
    });

    test("isDefined", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, isDefined);
        t.notOk(isDefined(undefined), t.name + " returns true for undefined");
        t.ok(isDefined(false)
             && isDefined(null)
             && isDefined(1)
             && isDefined("foo")
             && isDefined([])
             && isDefined({})
             && isDefined(function(){})
             , t.name + " returns false for everything else");
    });

    test("isArray", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, isArray);
        t.ok(isArray([]), t.name + " returns true for Array literals");
        t.ok(isArray(new Array(4)), t.name + " returns true for Array instances");
        t.notOk(isArray(null)
                && isArray(undefined)
                && isArray(1)
                && isArray(false)
                && isArray("foo")
                && isArray({})
                && isArray(function(){})
                , t.name + "returns false for everything else");
    });

    test("isString", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, isString);
        t.ok(isString("foo"), t.name + " returns true for String literals");
        t.ok(isString(new String("foo")), t.name + " returns true for String instances");
        t.notOk(isString(null)
                && isString(undefined)
                && isString(1)
                && isString(true)
                && isString([])
                && isString({})
                && isString(function(){})
                , t.name + "returns false for everything else");
    });

    test("isFunction", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, isFunction); // circular logic!
        t.ok(isFunction(function(){}), t.name + " returns true for Function's");
        t.notOk(isFunction(null)
                && isFunction(undefined)
                && isFunction(1)
                && isFunction("foo")
                && isFunction(true)
                && isFunction([])
                && isFunction({})
                , t.name + "returns false for everything else");
    });

    test("isInfinity", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, isInfinity);
        t.ok(isInfinity(Infinity), t.name + " returns true for Infinity");
        t.notOk(isInfinity(null)
                && isInfinity(undefined)
                && isInfinity(1)
                && isInfinity("foo")
                && isInfinity(true)
                && isInfinity([])
                && isInfinity({})
                && isInfinity(function(){})
                , t.name + "returns false for everything else");
    });

    test("isObject", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, isObject);
        t.ok(isObject({}), t.name + " returns true for Object literals");
        t.ok(isObject(new Object({ foo: "bar" })), t.name + " returns true for Object instances");
        t.notOk(isObject(null)
                && isObject(undefined)
                && isObject(1)
                && isObject("foo")
                && isObject(true)
                && isObject([])
                && isObject(function(){})
                , t.name + "returns false for everything else");
    });

    test("isNumber", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, isNumber);
        t.ok(isNumber(99), t.name + " returns true for Number literals");
        t.ok(isNumber(new Number(99)), t.name + " returns true for Number instances");
        t.notOk(isNumber(null)
                && isNumber(undefined)
                && isNumber("foo")
                && isNumber(true)
                && isNumber([])
                && isNumber({})
                && isNumber(function(){})
                , t.name + "returns false for everything else");
    });

    test("isInteger", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, isInteger);
        t.ok(isInteger(99), t.name + " returns true for Number literals that are integers");
        t.ok(isInteger(new Number(99)), t.name + " returns true for Number instances that are integers");
        t.notOk(isInteger(null)
                && isInteger(undefined)
                && isInteger("foo")
                && isInteger(true)
                && isInteger([])
                && isInteger(4.5)
                && isInteger({})
                && isInteger(function(){})
                , t.name + "returns false for everything else");
    });

    test("isRegexp", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, isRegexp);
        t.ok(isRegexp(/foo/), t.name + " returns true for RegExp literals");
        t.ok(isRegexp(new RegExp(/foo/)), t.name + " returns true for RegExp instances");
        t.notOk(isRegexp(null)
                && isRegexp(undefined)
                && isRegexp("foo")
                && isRegexp(true)
                && isRegexp([])
                && isRegexp(4.5)
                && isRegexp({})
                && isRegexp(function(){})
                , t.name + "returns false for everything else");
    });

    test("arg", function(t) {
        t.plan(6);
        util.assertFunction(t, 1, arg);
        var succ = " returns a function that returns the nth argument (0-indexed)";
        t.equal(arg(1)(1, 2, 3), 2, t.name + succ);

        function passneg()   { arg(-4);    }
        function passnon()   { arg("foo"); }
        function passfloat() { arg(1.1);   }

        util.assertThrows(t, passneg, "passed a negative integer");
        util.assertThrows(t, passnon, "passed a non-number");
        util.assertThrows(t, passfloat, "passed a float");
    });

    test("If", function(t) {
        t.plan(3);
        util.assertFunction(t, 1, If);
        t.ok(If(true).Then(true).Else(false)
             && If(false).Then(false).Else(true)
             && If(false).Then(false).Elif(true).Then(true)
             , t.name + " provides an If/Elif/Else control structure");
    });

    test("curry", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, curry);
        function add(x, y) { return x + y; }
        var add1 = curry(add, 1);
        t.ok(isFunction(add1), t.name + " partially applies functions");
        var bad = function() { curry("foo", 1); };
        util.assertThrows(t, bad, "the first argument is not a function");
    });

    test("autoCurry", function(t) {
        t.plan(2);
        util.assertFunction(t, 2, autoCurry);
    });

    test("Function.prototype.autoCurry", function(t) {
        t.plan(2);
        util.assertFunction(t, 1, Function.prototype.autoCurry);
    });

    test("compose", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, compose);
        var greetPerson = compose(greet, capitalize);
        t.equal(greetPerson("klaatu"), "Hi, Klaatu"
                , t.name + " composes functions in right-to-left order");
    });

    test("composer", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, composer);
        var greetPerson = composer(capitalize, greet);
        t.equal(greetPerson("klaatu"), "Hi, Klaatu"
                , t.name + " composes functions in left-to-right order");
    });

    test("flip", function(t) {
        t.plan(3);
        util.assertFunction(t, 1, flip);
        function subtract(x, y) { return y - x; }
        t.equal(flip(subtract)(5, 1), 4,
                t.name + " flips the arguments of functions that take two arguments");
    });

    test("until", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, until);
        function greaterThan100(x) { return x > 100; }
        function multiplyBy2(x) { return x * 2; }
        var smallestPow2GreaterThan100 = until(greaterThan100, multiplyBy2);
        util.assertCurriedFunction(t, 0, smallestPow2GreaterThan100);
        t.equal(smallestPow2GreaterThan100(1), 128,
                t.name + " applies f to the 3rd arg until p holds true");
    });

    test("equal", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, equal);
        var equals5 = equal(5);
        util.assertCurriedFunction(t, 0, equals5);
        t.ok(equals5("5"), t.name + " makes comparisons with ==");
    });

    test("identical", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, identical);
        var is5 = identical(5);
        util.assertCurriedFunction(t, 0, is5);
        t.notOk(is5("5"), t.name + " does no type coercion");
        t.ok(is5(5), t.name + " compares with ===");
    });

    test("deepEqual", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, deepEqual);
        var foobar = { foo: { bar: 3 } };
        var de = deepEqual(foobar);
        util.assertCurriedFunction(t, 0, de);
        var val1 = { foo: { bar: "3" } };
        var val2 = { foo: { bar: 6 } };
        t.ok(de(val1),
             t.name + " says that " + JSON.stringify(val1) + " equals " + JSON.stringify(foobar));
        t.notOk(de(val2),
                t.name + " says that " + JSON.stringify(val2) + " does not equal " + JSON.stringify(foobar));
    });

    test("strictDeepEqual", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, strictDeepEqual);
        var foobar = { foo: { bar: 3 } };
        var sde = strictDeepEqual(foobar);
        util.assertCurriedFunction(t, 0, sde);
        var val1 = { foo: { bar: "3" } };
        var foobar2 = { foo: { bar: 3 } };
        t.notOk(sde(val1),
                t.name + " says that " + JSON.stringify(val1) + " does not equal " + JSON.stringify(foobar));
        t.ok(sde(foobar2),
             t.name + " says that " + JSON.stringify(foobar2) + " equals " + JSON.stringify(foobar));
    });

    test("and", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, and);
        t.ok(and(true, true) && (! and(true, false)), t.name + " and's its arguments together");
    });

    test("or", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, or);
        t.ok(or(true, false) && (! or(false, false)), t.name + " or's its arguments together");
    });

    test("not", function(t) {
        t.plan(3);
        util.assertFunction(t, 1, not);
        t.ok(not(false) && (! not(true)), t.name + " returns !arg");
    });

    test("pluck", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, pluck);
        var name = pluck("name");
        var brian = { name: "brian" };
        util.assertCurriedFunction(t, 0, name);
        t.equal(name(brian), "brian",
                t.name + " returns a property of an Object");
    });

    test("dot", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, dot);
        var person = { name : "Brian" };
        t.equal(flip(pluck)(person, "name"),
                dot(person, "name"),
                t.name + " acts just like flip(pluck)");
    });

    test("has", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, has);
        var obj = { foo: 1, bar: 2 };
        var hasFoo = has("foo");
        var hasBaz = has("baz");
        util.assertCurriedFunction(t, 0, hasFoo);
        t.ok(hasFoo(obj),
             t.name + " returns true if the object returns true for hasOwnProperty");
        t.notOk(hasBaz(obj),
                t.name + " returns false if the object returns false for hasOwnProperty");
    });

    test("instanceOf", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, instanceOf);
        function MyClass() {}
        var myInstance = instanceOf(MyClass);
        util.assertCurriedFunction(t, 0, myInstance);
        t.ok(myInstance(new MyClass()), t.name + " tests if `object instanceof constructor`");
        t.notOk(myInstance({ foo: "bar" }), t.name + " fails if not `object instanceof constructor`");
    });

    test("typeOf", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, typeOf);
        var isStr = typeOf("string");
        util.assertCurriedFunction(t, 0, isStr);
        t.ok(isStr("foo"), t.name + " returns true if a string literal is a typeof 'string'");
        t.notOk(isStr([1,2,3]), t.name + " returns false if an array literal is a typeof 'string'");
    });

    test("objMap", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, objMap);
        var obj = { winners: 34, losers: 33 };
        var myMap = objMap(function(k, v) { return v + 1; });
        var myArr = myMap(obj);
        util.assertCurriedFunction(t, 0, myMap);
        t.ok(myArr.indexOf(34) !== -1 &&
             myArr.indexOf(35) !== -1, t.name + " maps an Object to an Array using a k/v callback");
    });

    test("keys", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, keys);
        var o = { foo: 1, bar: 2 };
        t.deepEqual(keys(o).sort(), ["bar", "foo"],
                    t.name + " returns an Array containing the keys of an Object");
    });

    test("vals", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, vals);
        var o = { foo: "bar", baz: "kludge" };
        t.deepEqual(vals(o).sort(), ["bar", "kludge"],
                    t.name + " returns an Array containing the values of an Object");
    });

    test("merge", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, merge);
        var o1 = { dir: "foo", files: ["a", "b", "c"] };
        var mergeO1 = merge(o1);
        util.assertCurriedFunction(t, 0, mergeO1);
        t.deepEqual(mergeO1({ dir: "bar", inodes: [1,2,3] }),
                    { dir: "bar", files: ["a", "b", "c"], inodes: [1,2,3] },
                    t.name + " merges Objects, giving precedence to properties of the 2nd Object");
    });

    test("reduceOwn", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, reduceOwn);
        var data = { foo: "1", bar: "erg2" };
        var f = reduceOwn(function(acc, k, v) {
            var intval = parseInt(v, 10);
            if (! isNaN(intval)) {
                acc[k] = intval;
            }
        });
        util.assertCurriedFunction(t, 0, f);
        var expectedResult = { foo: 1 };
        t.deepEqual(expectedResult, f(data),
                    t.name + " maps one Object onto another with the provided callback");
    });

    test("filterOwn", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, filterOwn);
        var o = { foo: 2, bar: 45, baz: "quux" };
        var f = filterOwn(function(k, v) {
            return v > 10;
        });
        t.deepEqual({ bar: 45 }, f(o),
                    t.name + " filters an Object with a k/v callback");
        
    });
};
