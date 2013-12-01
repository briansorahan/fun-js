/**
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */

var fun = {};

/**
 * id :: _ -> _
 * @function
 */
fun.id = function(x) {
    return x;
};

////////////////////////////////////////
// type checking
////////////////////////////////////////

/**
 * isNull :: _ -> Boolean
 * @function
 */
fun.isNull = function(obj) {
    return obj === null;
};

/**
 * isDefined :: _ -> Boolean
 * @function
 */
fun.isDefined = function(obj) {
    return typeof obj !== 'undefined';
};

//+ isArray :: _ -> Boolean
fun.isArray = function(obj) {
    return fun.isDefined(obj) && (! fun.isNull(obj))
	&& (typeof obj === 'object')
	&& (obj.constructor == Array);
};

//+ isObject :: _ -> Boolean
fun.isObject = function(obj) {
    return ((typeof obj === "object") && (! fun.isArray(obj)));
};

//+ isNonNullObject :: _ -> Boolean
fun.isNonNullObject = function(obj) {
    return obj !== undefined && obj !== null && fun.isObject(obj);
};

//+ isNumber :: _ -> Boolean
fun.isNumber = function(n) {
    return (typeof n === 'number')
	    && !isNaN(parseFloat(n))
	    && isFinite(n);
};

////////////////////////////////////////
// Function
////////////////////////////////////////

//- from wu.js <http://fitzgen.github.com/wu.js/>
//+ curry :: f -> _ ... -> g
var curry = function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
	    return fn.apply(fn, args.concat(Array.prototype.slice.call(arguments)));
    };
};

// make curry public
fun.curry = curry;

//- from wu.js <http://fitzgen.github.com/wu.js/>
//+ autoCurry :: Function -> Function
var autoCurry = function (fn, numArgs) {
    var expectedArgs = numArgs || fn.length;
    return function () {
        if (arguments.length < expectedArgs) {
            // A curried version of fn
            var curried = curry.apply(this, [fn].concat(Array.prototype.slice.call(arguments)));
            var rem = numArgs - arguments.length;
            // If we still don't have the expected number of arguments,
            // return 
            return expectedArgs - arguments.length > 0 ? autoCurry(curried, rem) : curried;
        } else {
            return fn.apply(this, arguments);
        }
    };
};

Function.prototype.autoCurry = function(n) {
    return autoCurry(this, n);
};

//+ compose :: f -> g -> h 
fun.compose = function () {
    var fns = Array.prototype.slice.call(arguments), numFns = fns.length;
    return function () {
        var i, returnValue = fns[numFns -1].apply(this, arguments);
        for (i = numFns - 2; i > -1; i--) {
            returnValue = fns[i](returnValue);
        }
        return returnValue;
    };
}.autoCurry();

//+ flip :: f -> g 
fun.flip = function(f) {
    return function () {
	return f(arguments[1], arguments[0]);
    };
};

//+ fst :: (a -> b -> c) -> a
fun.fst = function(a, b) {
    return a;
};

//+ snd :: (a -> b -> c) -> a
fun.snd = function(a, b) {
    return b;
};

////////////////////////////////////////
// Logic
////////////////////////////////////////

//+ and :: _ ... -> Boolean
fun.and = function () {
    var args = Array.prototype.slice.call(arguments);
    return function () {
	return reduce(function(acc, v) {
	    return acc && v;
	}, true, args.concat(Array.prototype.slice.call(arguments)));
    };
}.autoCurry();

//+ or :: _ ... -> Boolean
fun.or = function () {
    var args = Array.prototype.slice.call(arguments);
    return function () {
	return reduce(function(acc, v) {
	    return acc || v;
	}, false, args.concat(Array.prototype.slice.call(arguments)));
    };
}.autoCurry();

//+ not :: _ -> Boolean
fun.not = function(x) {
    return !x;
};

////////////////////////////////////////
// Comparison
////////////////////////////////////////

//+ equal :: a -> a -> Boolean
// Note: type coercion
fun.equal = function (x, y) {
    return x == y;
}.autoCurry();

//+ identical :: a -> a -> Boolean
fun.identical = function (x, y) {
    return x === y;
}.autoCurry();

//+ gt :: a -> a -> Boolean
fun.gt = function(x, y) {
    return x < y;
}.autoCurry();

//+ gte :: a -> a -> Boolean
fun.gte = function(x, y) {
    return x <= y;
}.autoCurry();

//+ lt :: a -> a -> Boolean
fun.lt = function(x, y) {
    return x > y;
}.autoCurry();

//+ lte :: a -> a -> Boolean
fun.lte = function(x, y) {
    return x >= y;
}.autoCurry();

////////////////////////////////////////
// Number
////////////////////////////////////////

//+ incr :: Int -> Int
fun.incr = function(x) {
    return fun.isNumber(x) ? x + 1 : undefined;
};

//+ decr :: Int -> Int
fun.decr = function(x) {
    return fun.isNumber(x) ? x - 1 : undefined;
};

//+ min :: [Number] -> Number
fun.min = function(ns) {
    return fun.isArray(ns) ? Math.min.apply(null, ns) : undefined;
};

//+ max :: [Number] -> Number
fun.max = function(ns) {
    return fun.isArray(ns) ? Math.max.apply(null, ns) : undefined;
};

//+ pow :: Number ... -> Number
fun.pow = function(exponent, base) {
    return Math.pow(base, exponent);
}.autoCurry();

//+ sum :: [Number] -> Number
fun.sum = function(ns) {
    return ns.reduce(function(acc, n) {
        return acc + n;
    }, 0);
};

//+ product :: [Number] -> Number
fun.product = function(ns) {
    return ns.reduce(function(acc, n) {
        return acc * n;
    }, 1);
};

////////////////////////////////////////
// Array
////////////////////////////////////////

//+ map :: (a -> b) -> [a] -> [b]
fun.map = function (fn, xs) {
    return xs.map(fn);
}.autoCurry();

//+ filter :: (a -> b) -> [a] -> [b]
fun.filter = function (fn, xs) {
    return xs.filter(fn);
}.autoCurry();

//+ reduce :: (a -> b -> b) -> [b] -> b
fun.reduce = function (f, initialValue, xs) {
    return xs.reduce(f, initialValue);
}.autoCurry();

//+ reduceRight :: (a -> b -> b) -> [b] -> b
fun.reduceRight = function (f, initialValue, xs) {
    return xs.reduceRight(f, initialValue);
}.autoCurry();

//+ empty :: Array -> Boolean
fun.empty = function(xs) {
    return xs.length === 0;
};

//+ head :: [a] -> a
fun.head = function(xs) {
    return xs.length ? xs[0] : undefined;
};

//+ tail :: [a] -> a
fun.tail = function(xs) {
    return xs.length ? Array.prototype.slice.call(xs, 1) : [];
};

//+ concat :: [_] -> [_] -> [_]
fun.concat = function(xs, ys) {
    return xs.concat(ys);
}.autoCurry();

//+ any :: (a -> Boolean) -> [a] -> Boolean
fun.any = function (f, xs) {
    return xs.some(f);
}.autoCurry();

//+ all :: (a -> Boolean) -> [a] -> Boolean
fun.all = function (f, xs) {
    return xs.every(f);
}.autoCurry();

//+ find :: (a -> Boolean) -> [a] -> a
fun.find = function(f, xs) {
    return xs.reduce(function(result, x) {
        return f(x) ? x : result;
    }, undefined);
}.autoCurry();

//+ zip :: (a -> b -> _) -> [a] -> [b] -> _
fun.zip = function(f, xs, ys) {
    var len = Math.min(xs.length, ys.length);
    var result = [];
    for (var i = 0; i < len; i++) {
	result[i] = f(xs[i], ys[i]);
    }
    return result;
}.autoCurry();

//+ join :: String -> [a] -> String
fun.join = function(string, xs) {
    return xs.join(string);
}.autoCurry();

//+ slice :: Int -> Int -> [a] -> [a]
fun.slice = function(lb, ub, xs) {
    return xs.slice(lb, ub);
}.autoCurry();

//+ reverse :: [a] -> [a]
fun.reverse = function(xs) {
    return Array.prototype.slice.call(xs, 0).reverse();
};

//+ indexOf :: [a] -> a -> Int
fun.indexOf = function(x, xs) {
    return xs.indexOf(x);
}.autoCurry();

//+ lastIndexOf :: [a] -> a -> Int
fun.lastIndexOf = function(x, xs) {
    return xs.lastIndexOf(x);
}.autoCurry();

//+ contains :: a -> [a] -> Boolean
// Works for Strings and Arrays!
fun.contains = function(x, xs) {
	return xs.indexOf(x) >= 0;
}.autoCurry();

//+ elem :: [a] -> a -> Boolean
// contains with the arguments reversed
// works better for currying
fun.elem = function(xs, x) {
    return xs.indexOf(x) >= 0;
}.autoCurry();

//+ complement :: [a] -> [a] -> [a]
// Return a list of all elements of ys
// that are not elements of xs.
var complement = function(xs, ys) {
    return fun.filter(fun.compose(fun.not, fun.elem(xs)), ys);
};

//+ diff :: [a] -> [a] -> Object
fun.diff = function(a, b) {
    if (! (fun.isArray(a) && fun.isArray(b))) {
        return undefined;
    } else {
        return {
            added: complement(a, b),
            removed: complement(b, a)
        };
    }
}.autoCurry();

//+ replicate :: Int -> a -> [a]
fun.replicate = function(n, v) {
    if (! fun.isNumber(n)) {
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
fun.take = function(n, xs) {
    if (! (fun.isNumber(n) && fun.isArray(xs))) {
        return undefined;
    } else if (n === 0 || fun.empty(xs)) {
        return [];
    } else {
        var _n = Math.floor(n);
        return xs.slice(0, _n);
    }
}.autoCurry();

//+ drop :: Int -> [a] -> [a]
fun.drop = function(n, xs) {
    if (! (fun.isNumber(n) && fun.isArray(xs))) {
        return undefined;
    } else if (fun.empty(xs)) {
        return [];
    } else {
        var _n = Math.floor(n);
        return xs.slice(_n);
    }
}.autoCurry();

////////////////////////////////////////
// Object
////////////////////////////////////////

//+ pluck :: String -> Object -> _
fun.pluck = function (name, obj) {
    return obj[name];
}.autoCurry();

//+ has :: String -> Object -> Boolean
fun.has = function(name, obj) {
    return obj.hasOwnProperty(name);
}.autoCurry();

//+ instanceOf :: Object -> Object -> Boolean
fun.instanceOf = function(constructor, obj) {
    return obj instanceof constructor;
}.autoCurry();

//+ objMap :: (String -> a -> b) -> Object -> [b]
// map over key/value pairs in an object
fun.objMap = function(f, obj) {
	var result = [], index = 0;
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			result[index++] = f(property, obj[property]);
		}
	}
	return result;
}.autoCurry();

fun.keys = fun.objMap(fun.fst);
fun.vals = fun.objMap(fun.snd);

//+ merge :: Object -> Object -> Object
// Note: Properties of the second argument take precedence
//       over identically-named properties of the first
//       argument.
fun.merge = function(obj1, obj2) {
	var result = {};
    [obj1, obj2].forEach(function(obj) {
        for (var p in obj) {
            if (fun.has(p, obj)) {
                result[p] = obj[p];
            }
        }
    });
    return result;
};

//+ reduceOwn :: Function -> Object -> Object
fun.reduceOwn = function(f, obj) {
    var wrapper = function(result, k) {
        f(result, k, obj[k]);
        return result;
    };

    return Object.getOwnPropertyNames(obj).reduce(wrapper, {});
}.autoCurry();

////////////////////////////////////////
// String
////////////////////////////////////////

//+ strcat :: String -> String -> String
fun.strcat = function(s, t) {
    return t.concat(s);
}.autoCurry();

//+ contains :: String -> String -> Boolean
// fun.contains = function(s, t) {
//     return t.contains(s);
// }.autoCurry();

//+ endsWith :: String -> String -> Boolean
// fun.endsWith = function(search, source) {
//     return source.endsWith(search);
// }.autoCurry();

//+ match :: RegExp -> String -> Boolean
fun.match = function(regex, string) {
    return string.match(regex);
}.autoCurry();

//+ replace :: RegExp|String -> String|Function -> String -> String
fun.replace = function(pat, subs, string) {
    return string.replace(pat, subs);
}.autoCurry();

//+ search :: RegExp -> String -> Int
fun.search = function(pat, string) {
    return string.search(pat);
}.autoCurry();

//+ split :: String -> String -> [String]
fun.split = function(pat, string) {
    return string.split(pat);
}.autoCurry();

//+ substr :: String -> String -> [String]
fun.substr = function(start, length, string) {
    return string.substr(start, length);
}.autoCurry();

//+ toLower :: String -> String
fun.toLower = function(string) {
    return string.toLowerCase();
};

//+ toUpper :: String -> String
fun.toUpper = function(string) {
    return string.toUpperCase();
};

//+ trim :: String -> String
fun.trim = function(string) {
    return string.trim();
};

//+ trimRight :: String -> String
fun.trimRight = function(string) {
    return string.trimRight();
};

//+ trimLeft :: String -> String
fun.trimLeft = function(string) {
    return string.trimLeft();
};

fun.isCommonJS = function() {
    return (typeof require === "function");
};

fun.isNodeJS = function() {
    return fun.isCommonJS()
        && (typeof module !== 'undefined')
        && (typeof module.exports !== 'undefined');
};

fun.isBrowser = function() {
    return typeof window === "object";
};

// Make functions globally available as properties of an object
//+ import :: Object -> _
fun.import = function(options) {
	var namespace = fun.has("under", options) ? options.under : undefined;

    if (namespace === undefined) {
        if (fun.isNodeJS()) {
            namespace = global;
        } else if (fun.isBrowser()) {
            namespace = window;
        }
    }

	var without = fun.has("without", options) ? options.without : [];
	var select = fun.has("select", options) ? options.select : [];

    /*
     * A function will not be imported if:
     * (1) It is in 'without';
     * (2) It is not in 'select' and 'select' is nonempty.
     * Note that all functions are imported if both 'select' and 'without' are empty.
     */
	fun.objMap(function(k, v) {
		if (fun.isNonNullObject(namespace) && k !== "import") {
            if (fun.contains(k, without)) {
                namespace[k] = undefined;
            } else if (fun.contains(k, select)) {
                namespace[k] = v;
            } else if (!fun.empty(select)) {
                namespace[k] = undefined;
            } else if (fun.empty(select) && fun.empty(without)) {
                namespace[k] = v;
            }
		}
	}, fun);

    return fun;
};

// if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
//     module.exports = fun;    
// } else {
//     window.fun = fun;
// }

if (fun.isNodeJS()) {
    module.exports = fun;    
} else if (fun.isBrowser()) {
    window.fun = fun;
}
