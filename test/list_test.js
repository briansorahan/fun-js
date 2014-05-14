/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
module.exports.run = function(test) {
    var fun           = require("../src")
      , util          = require("./util")
      , compose       = fun.compose
      , identical     = fun.identical
      , pluck         = fun.pluck
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
      , elem          = fun.elem
      , complement    = fun.complement
      , Pair          = fun.Pair
      , fst           = fun.fst
      , snd           = fun.snd
      , isPair        = fun.isPair
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

    test("concat", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, concat);
        var arrayCopy = concat([]);
        util.assertCurriedFunction(t, 0, arrayCopy);
        t.deepEqual(arrayCopy([1,2,3]), [1,2,3],
                    t.name + " works just like Array.prototype.concat");
    });

    test("any", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, any);
        var contains4 = any(function(x) { return x === 4; });
        util.assertCurriedFunction(t, 0, contains4);
        t.ok(contains4([1,2,3,4]) && !contains4([1,2,3,5]),
             t.name + " works just like Array.prototype.some");
    });

    test("all", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, all);
        var allTruthy = all(function(x) { return !!x; });
        util.assertCurriedFunction(t, 0, allTruthy);
        t.ok(allTruthy([1,2,3,4]) && !allTruthy([1,2,3,5,null]),
             t.name + " works just like Array.prototype.every");
    });

    test("iterate", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, iterate);
        var pows2From = iterate(function(x) { return x * 2; });
        util.assertCurriedFunction(t, 0, pows2From);
        var iter = pows2From(1);
        while (iter.val() < 200) {
            iter = iter.next();
        }
        t.equal(iter.val(), 256,
                t.name + " applies f to x as many times as you want");
    });

    test("find", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, find);

        var findBrian = find(compose(identical("Brian"), pluck("name")));

        util.assertCurriedFunction(t, 0, findBrian);

        var good = [
            { name: "Klaatu" }
          , { name: "Brian" }
        ];

        var bad = [
            { name: "Klaatu" }
          , { name: "Barada" }
          , { name: "Nikto" }
        ];

        t.deepEqual(findBrian(good), { name: "Brian" },
                    t.name + " returns the first value in an Array that satisfies the callback");

        t.equal(List.NotFound, findBrian(bad),
                t.name + " returns List.NotFound if it can't find any element satisfying the callback");
    });

    test("zip", function(t) {
        t.plan(3);
        util.assertFunction(t, 0, zip);

        var pairwiseEqual = function(xs, ys) {
            return xs.length === ys.length
                && xs.reduce(function(acc, x, i) {
                    return acc && x.eq(ys[i]);
                }, true);
        };

        var l1 = [1,2,3];
        var l2 = [4,5,6];
        var result = [ Pair(1, 4), Pair(2, 5), Pair(3, 6) ];

        t.ok(pairwiseEqual(zip(l1, l2), result),
             t.name + " returns a list of Pairs");
    });

    test("zipWith", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, zipWith);
        var l1 = [1,2,3];
        var l2 = [4,5,6];
        var result = [5,7,9];
        var add = function(a, b) { return a + b; };
        var addLists = zipWith(add);
        util.assertCurriedFunction(t, 0, addLists);
        t.deepEqual(result, addLists(l1, l2),
                    t.name + " zips two lists with the provided function");
    });

    test("unzip", function(t) {
        t.plan(3);
        util.assertFunction(t, 1, unzip);

        var l = [
            Pair(1, 4),
            Pair(2, 5),
            Pair(3, 6)
        ];

        t.ok(unzip(l).eq(Pair([1,2,3], [4,5,6])),
             t.name + " maps a list of Pairs to a Pair of lists");
    });

    test("join", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, join);
        var l = ["a", "b", "c"];
        var toCSV = join(",");
        util.assertCurriedFunction(t, 0, toCSV);
        t.equal(toCSV(l), "a,b,c",
                t.name + " works just like String.prototype.join");
    });

    test("slice", function(t) {
        t.plan(4);
        util.assertFunction(t, 0, slice);
        var f  = slice(2, 4);
        t.equal(f("brian"), "ia",
                t.name + " works for strings");
        t.deepEqual(f([1,2,3,4,5]), [3,4],
                t.name + " works for arrays");
    });

    test("reverse", function(t) {
        t.plan(3);
        util.assertFunction(t, 1, reverse);
        var l = [1,2,3,4];
        t.deepEqual(reverse(l), [4,3,2,1],
                    t.name + " returns a reversed copy of an array");
    });

    test("indexOf", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, indexOf);
        var l = ["a", "b", "c", "d", "e"];
        var indexOfe = indexOf("e");
        util.assertCurriedFunction(t, 0, indexOfe);
        t.equal(indexOfe(l), 4,
                t.name + " works for arrays");
        t.equal(indexOfe("haskell"), 4,
                t.name + " works for strings");
    });

    test("lastIndexOf", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, lastIndexOf);
        var l = ["a", "b", "c", "c", "d", "e"];
        var lastIndexOfc = lastIndexOf("c");
        util.assertCurriedFunction(t, 0, lastIndexOfc);
        t.equal(lastIndexOfc("hectic"), 5,
                t.name + " works for strings");
        t.equal(lastIndexOfc(l), 3,
                t.name + " works for arrays");
    });

    test("contains", function(t) {
        t.plan(6);
        util.assertFunction(t, 0, contains);
        var l = ["a", "b", "c", "c", "d", "e"];
        var containsc = contains("c");
        util.assertCurriedFunction(t, 0, containsc);
        t.ok(containsc("hectic"),
                t.name + " works for strings");
        t.ok(containsc(l),
                t.name + " works for arrays");
    });

    test("elem", function(t) {
        t.plan(5);
        util.assertFunction(t, 0, elem);
        var l = ["a", "b", "c", "c", "d", "e"];
        var eleml = elem(l);
        util.assertCurriedFunction(t, 0, eleml);
        t.ok(eleml("c") && !eleml("f"),
                t.name + " determines if an Array contains a given element");
    });
};
