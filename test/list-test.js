/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
module.exports.run = function(test) {
    var fun           = require("../src")
      , util          = require("./util")
      , List          = fun.List
      , map           = fun.map
      , filter        = fun.filter
      , reduce        = fun.reduce
      , reduceRight   = fun.reduceRight
      , empty         = fun.empty
      , head          = fun.head
      , last          = fun.last
      , tail          = fun.tail
      , init          = fun.init
      , concat        = fun.concat
      , any           = fun.any
      , all           = fun.all
      , iterate       = fun.iterate
      , find          = fun.find
      , zip           = fun.zip
      , zipWith       = fun.zipWith
      , unzip         = fun.unzip
      , join          = fun.join
      , slice         = fun.slice
      , reverse       = fun.reverse
      , indexOf       = fun.indexOf
      , lastIndexOf   = fun.lastIndexOf
      , contains      = fun.contains
    ;

    test("map", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, map);
        var addOne = map(function(x) { return x + 1; });
        var xs = [1, 2, 3, 4];
        util.assertCurriedFunction(t, 0, addOne);
        t.deepEqual([2,3,4,5], addOne(xs),
                    t.name + " functions just like Array.prototype.map");
    });

    test("filter", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, filter);
        var gt20 = filter(function(x) { return x > 20; });
        var xs = [10, 20, 30, 40];
        util.assertCurriedFunction(t, 0, gt20);
        t.deepEqual([30, 40], gt20(xs),
                    t.name + " functions just like Array.prototype.filter");
    });

    test("reduce", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, reduce);
        var runningSum = reduce(function(acc, x) { return acc + x; }, 0);
        var xs = [1, 2, 3, 4, 5];
        util.assertCurriedFunction(t, 0, runningSum);
        t.equal(15, runningSum(xs),
                t.name + " functions just like Array.prototype.reduce");
    });

    test("reduceRight", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, reduce);
        var runningSum = reduce(function(acc, x) { return acc + x; }, 0);
        var xs = [1, 2, 3, 4, 5];
        util.assertCurriedFunction(t, 0, runningSum);
        t.equal(15, runningSum(xs),
                t.name + " functions just like Array.prototype.reduce");
    });

    test("empty", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, empty);
        t.ok(empty([]) && empty(""),
             t.name + " works for strings and arrays");
        t.notOk(empty([1,2,3]) || empty("foo"),
                t.name + " returns false for non-empty arrays and strings");
        t.ok(empty({ length: 0 }),
             t.name + " works for any object that has a 'length' property");
    });

    test("head", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, head);
        t.ok(head([1,2,3]) === 1 && head("foo") === "f",
             t.name + " works for strings and arrays");
        t.ok(List.Empty === head([]) && List.Empty === head(""),
                t.name + " returns List.Empty if passed the empty array or the empty string");
    });

    test("last", function(t) {
        t.plan(4);
        util.assertFunction(t, 1, last);
        t.ok(last([1,2,3,4]) === 4 && last("klaatu") === "u",
             t.name + " works for arrays and strings");
        t.ok(List.Empty === last([]) && List.Empty === last(""),
             t.name + " returns List.Empty for empty arrays and strings");
    });

    test("tail", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, tail);
        t.deepEqual(tail([1,2,3,4]), [2,3,4],
                    t.name + " works for arrays");
        t.equal(tail("foobar"), "oobar",
                t.name + " works for strings");
        t.ok(List.Empty === tail([]) && List.Empty === tail(""),
             t.name + " returns List.Empty for the empty array and the empty string");
    });

    test("init", function(t) {
        t.plan(5);
        util.assertFunction(t, 1, init);
        t.deepEqual(init([1,2,3,4]), [1,2,3],
                    t.name + " works for arrays");
        t.equal(init("klaatu"), "klaat",
                t.name + " works for strings");
        t.ok(List.Empty === init([]) && List.Empty === init(""),
             t.name + " returns List.Empty for the empty array and the empty string");
    });
};
