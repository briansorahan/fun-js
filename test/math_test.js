// -*- mode: js2; -*-
module.exports.run = function(test) {
    var fun = require("../src")
      , util = require("./util")
      , incr = fun.incr
      , decr = fun.decr
      , min = fun.min
      , max = fun.max
      , add = fun.add
      , multiply = fun.multiply
      , divide = fun.divide
      , pow = fun.pow
      , rem = fun.rem
      , even = fun.even
      , odd = fun.odd
      , sum = fun.sum
      , product = fun.product
      , gt = fun.gt
      , gte = fun.gte
      , lt = fun.lt
      , lte = fun.lte
    ;

    test("incr", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, incr);
        t.equal(incr(3), 4,
                t.name + " increments integers");
        function bad() { incr("foo"); }
        util.assertThrows(t, bad, "passed anything but an integer");
    });

    test("decr", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, decr);
        t.equal(decr(4), 3,
                t.name + " decrements integers");
        function bad() { decr("foo"); }
        util.assertThrows(t, bad, "passed anything but an integer");
    });

    test("min", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, min);
        t.equal(4, min([4,5,6,7]),
                "applies Math.min to an array");
        function bad() { return min(1,2,3); }
        util.assertThrows(t, bad, "when not passed an array");
    });

    test("max", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, max);
        t.equal(7, max([4,5,6,7]),
                "applies Math.max to an array");
        function bad() { return max(1,2,3); }
        util.assertThrows(t, bad, "when not passed an array");
    });

    test("add", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, add);
        var addOne = add(1);
        util.assertCurriedFunction(t, 0, addOne);
        t.equal(3, addOne(2),
                t.name + " adds two numbers");
    });

    test("multiply", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, multiply);
        var triple = multiply(3);
        util.assertCurriedFunction(t, 0, triple);
        t.equal(6, triple(2),
                t.name + " multiplies two numbers");
    });

    test("divide", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, divide);
        var halve = divide(2);
        util.assertCurriedFunction(t, 0, halve);
        t.equal(1, halve(2),
                t.name + " divides two numbers");
        t.equal(Infinity, divide(3, 0),
                t.name + " returns Infinity when dividing by 0");
    });

    test("pow", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, pow);
        var square = pow(2);
        util.assertCurriedFunction(t, 0, square);
        t.equal(25, square(5),
                t.name + " calls Math.pow");
    });

    test("rem", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, rem);
        var rem3 = rem(3);
        util.assertCurriedFunction(t, 0, rem3);
        t.equal(rem3(8), 2,
                t.name + " computes the remainder of dividing the second arg by the first arg");
        function bad() { return rem("foo", {}); }
        util.assertThrows(t, bad, "when not passed integers");
    });

    test("even", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, even);
        t.ok(even(2) && !even(5),
             t.name + " returns true/false whether the number is even/odd");
        function bad() { return even(["bar"]); }
        util.assertThrows(t, bad, "when not passed an integer");
    });

    test("odd", function(t) {
        t.plan(4);
        util.assertFunction(t, 0, odd);
        t.ok(!odd(2) && odd(5),
             t.name + " returns true/false whether the number is odd/even");
        function bad() { return odd(["bar"]); }
        util.assertThrows(t, bad, "when not passed an integer");
    });

    test("sum", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, sum);
        t.equal(sum([3,4,5,6,7]), 25,
                t.name + " sums an array of numbers");
        function bad() { return sum(["foo", "bar"]); }
        util.assertThrows(t, bad, "when not passed an array of numbers");
    });

    test("product", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, product);
        t.equal(product([3,4,5]), 60,
                        t.name + " multiplies an array of numbers");
        function bad() { return product("foo"); }
        util.assertThrows(t, bad, "when not passed an array of numbers");
    });

    test("gt", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, gt);
        var gt4 = gt(4);
        util.assertCurriedFunction(t, 0, gt4);
        t.ok(gt4(6), t.name + " gt(x, y) determines if x < y");
    });

    test("gte", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, gte);
        var gte4 = gte(4);
        util.assertCurriedFunction(t, 0, gte4);
        t.ok(gte4(6) && gte4(4), t.name + " gte(x, y) determines if x <= y");
    });

    test("lt", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, lt);
        var lt4 = lt(4);
        util.assertCurriedFunction(t, 0, lt4);
        t.ok(lt4(3), t.name + " lt(x, y) determines if x > y");
    });

    test("lte", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, lte);
        var lte4 = lte(4);
        util.assertCurriedFunction(t, 0, lte4);
        t.ok(lte4(3) && lte4(4), t.name + " lte(x, y) determines if x >= y");
    });
};