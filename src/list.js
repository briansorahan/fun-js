/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex          = {}
  , core        = require("./core")
  , iface       = require("./iface")
  , pair        = require("./pair")
  , compose     = core.compose
  , not         = core.not
  , until       = core.until
  , Iface       = iface.Iface
  , isArray     = core.isArray
  , isFunction  = core.isFunction
  , isInteger   = core.isInteger
  , isNumber    = core.isNumber
  , isString    = core.isString
  , Pair        = pair.Pair
  , fst         = pair.fst
  , snd         = pair.snd
;

//+ map :: (a -> b) -> [a] -> [b]
ex.map = function (fn, xs) { return xs.map(fn); }.autoCurry();

//+ filter :: (a -> b) -> [a] -> [b]
ex.filter = function (fn, xs) { return xs.filter(fn); }.autoCurry();

//+ reduce :: (a -> b -> b) -> [b] -> b
ex.reduce = function (fn, initialValue, xs) {
    return xs.reduce(fn, initialValue);
}.autoCurry();

//+ reduceRight :: (a -> b -> b) -> [b] -> b
ex.reduceRight = function (fn, initialValue, xs) {
    return xs.reduceRight(fn, initialValue);
}.autoCurry();

//+ empty :: Array -> Boolean
ex.empty = function(xs) { return xs.length === 0; };

ex.List = {
    Empty: []
  , NotFound: {}
};

//+ head :: [a] -> a
ex.head = function(xs) {
    return ex.empty(xs) ? ex.List.Empty : xs[0];
};

//+ last :: [a] -> a
ex.last = function(xs) {
    return ex.empty(xs) ? ex.List.Empty : xs.slice(-1)[0];
};

//+ tail :: [a] -> a
ex.tail = function(xs) {
    return ex.empty(xs) ? ex.List.Empty : xs.slice(1);
};

//+ init :: [a] -> [a]
ex.init = function(xs) {
    return ex.empty(xs) ? ex.List.Empty : xs.slice(0, -1);
};

//+ concat :: [_] -> [_] -> [_]
ex.concat = function(xs, ys) { return xs.concat(ys); }.autoCurry();

//+ any :: (a -> Boolean) -> [a] -> Boolean
ex.any = function (f, xs) { return xs.some(f); }.autoCurry();

//+ all :: (a -> Boolean) -> [a] -> Boolean
ex.all = function (f, xs) { return xs.every(f); }.autoCurry();

ex.Iter = Iface.parse("done next");

//+ iterate :: (a -> a) -> a -> [a]
//! Returns a LazyList of repeated applications of f to x
ex.iterate = function(f, x) {
    return ex.Iter.instance({
        val:  function() { return x; },
        next: function() { return ex.iterate(f, f(x)); },
        done: function() { return false; }
    });
}.autoCurry();

//+ foreach :: Iter -> Iter
// ex.foreach = function(iter, condition, f) {
//     var acc = [];
//     while (condition(iter.val())) {
//         acc.push(f(iter.val()));
//         iter = iter.next();
//     }
//     return acc;
// };

//+ find :: (a -> Boolean) -> [a] -> a
ex.find = function(f, xs) {
    return xs.reduce(function(result, x) {
        return result !== ex.List.NotFound ? result : (f(x) ? x : result);
    }, ex.List.NotFound);
}.autoCurry();

//+ zip :: [a] -> [b] -> [ Pair a b ]
ex.zip = function(xs, ys) {
    if (ex.empty(xs) || ex.empty(ys)) {
        return [];
    } else if (xs.length > ys.length) {
        return ys.reduce(function(acc, y, i) {
            return acc.concat(Pair(xs[i], y));
        }, []);
    } else {
        return xs.reduce(function(acc, x, i) {
            return acc.concat(Pair(x, ys[i]));
        }, []);
    }
}.autoCurry();

//+ zipWith :: (a -> b -> _) -> [a] -> [b] -> _
ex.zipWith = function(f, xs, ys) {
    var len = Math.min(xs.length, ys.length);
    var result = [];
    for (var i = 0; i < len; i++) {
	    result[i] = f(xs[i], ys[i]);
    }
    return result;
}.autoCurry();

//+ unzip :: [ Pair a b ] -> Pair([a], [b])
ex.unzip = function(ps) {
    if (! isArray(ps))
        throw new Error("unzip expects an Array");

    if (ex.empty(ps)) {
        return [];
    } else {
        var lists = ps.reduce(function(acc, p) {
            acc.as.push(fst(p));
            acc.bs.push(snd(p));
            return acc;
        }, { as: [], bs: [] });
        return Pair(lists.as, lists.bs);
    }
};

/*
 * I have included String functions here, because there is
 * some beautiful polymorphism going on (i.e. you can pass either
 * String or Array to many of the functions below).
 * [bsorahan]
 */

//+ join :: String -> [a] -> String
ex.join = function(string, xs) { return xs.join(string); }.autoCurry();

//+ slice :: Int -> Int -> [a] -> [a]
ex.slice = function(lb, ub, xs) { return xs.slice(lb, ub); }.autoCurry();

//+ reverse :: [a] -> [a]
ex.reverse = function(xs) {
    return Array.prototype.slice.call(xs, 0).reverse();
};

//+ indexOf :: [a] -> a -> Int
ex.indexOf = function(x, xs) { return xs.indexOf(x); }.autoCurry();

//+ lastIndexOf :: [a] -> a -> Int
ex.lastIndexOf = function(x, xs) { return xs.lastIndexOf(x); }.autoCurry();

//+ contains :: a -> [a] -> Boolean
ex.contains = function(x, xs) { return xs.indexOf(x) >= 0; }.autoCurry();

//+ elem :: [a] -> a -> Boolean
// contains with the arguments reversed
// works better for currying
ex.elem = function(xs, x) { return xs.indexOf(x) >= 0; }.autoCurry();

//+ complement :: [a] -> [a] -> [a]
//! Return a list of all elements of ys that are not elements of xs.
ex.complement = function(xs, ys) {
    return ex.filter(compose(not, ex.elem(xs)), ys);
};

//+ diff :: [a] -> [a] -> Object
ex.diff = function(a, b) {
    if (! (isArray(a) && isArray(b))) {
        return undefined;
    } else {
        return {
            added: ex.complement(a, b),
            removed: ex.complement(b, a)
        };
    }
}.autoCurry();

//+ replicate :: Int -> a -> [a]
ex.replicate = function(n, v) {
    if (! isNumber(n)) {
        return undefined;
    } else if (n === 0) {
        return [];
    } else {
        var _n = Math.floor(n);
        var arr = new Array(_n);
        for (var i = 0; i < _n; i++) {
            arr[i] = v;
        }
        return arr;
    }
}.autoCurry();

//+ take :: Int -> [a] -> [a]
ex.take = function(n, xs) {
    if (! (isNumber(n) && isArray(xs))) {
        return undefined;
    } else if (n === 0 || ex.empty(xs)) {
        return [];
    } else {
        var _n = Math.floor(n);
        return xs.slice(0, _n);
    }
}.autoCurry();

//+ drop :: Int -> [a] -> [a]
ex.drop = function(n, xs) {
    if (! (isNumber(n) && isArray(xs))) {
        return undefined;
    } else if (ex.empty(xs)) {
        return [];
    } else {
        var _n = Math.floor(n);
        return xs.slice(_n);
    }
}.autoCurry();

//+ splitAt :: Int -> [a] -> Pair [a] [a]
ex.splitAt = function(n, xs) {
    if (! (isNumber(n) && isArray(xs))) {
        return undefined;
    } else if (ex.empty(xs)) {
        return [];
    } else {
        return Pair(ex.take(n, xs), ex.drop(n, xs));
    }
}.autoCurry();

//+ takeWhile :: (a -> Boolean) -> [a] -> [a]
ex.takeWhile = function(p, xs) {
    if (! (isFunction(p) && isArray(xs))) {
        return undefined;
    } else if (ex.empty(xs)) {
        return [];
    } else {
        var result = [];
        for (var i = 0; i < xs.length; i++) {
            if (p(xs[i])) {
                result.push(xs[i]);
            } else {
                break;
            }
        }
        return result;
    }
}.autoCurry();

//+ dropWhile :: (a -> Boolean) -> [a] -> [a]
ex.dropWhile = function(p, xs) {
    if (! (isFunction(p) && isArray(xs)))
        throw new Error("dropWhile expects a Function and an Array");

    if (ex.empty(xs)) {
        return [];
    } else {
        var i;
        for (i = 0; i < xs.length; i++) {
            if (! p(xs[i])) {
                return xs.slice(i);
            }
        }

        return [];
    }
}.autoCurry();

//+ span :: (a -> Boolean) -> [a] -> ([a], [a])
ex.span = function(p, xs) {
    if (! (isFunction(p) && isArray(xs))) {
        return undefined;
    } else if (ex.empty(xs)) {
        return Pair([], []);
    } else {
        var i;
        for (i = 0; i < xs.length; i++) {
            if (! p(xs[i])) {
                return Pair(xs.slice(0, i), xs.slice(i));
            }
        }

        return Pair(xs.slice(0), []);
    }
}.autoCurry();



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
