/**
 * fun.js
 * ====================
 * 
 * A mish-mash of useful functions to enable haskell-style
 * coding in js. Mostly taken from wu.js, loop-recur, and
 * underscore.js.
 * 
 * Usage
 * --------------------
 * - node.js
 * - browser
 */

var fun = {};
var slice = Array.prototype.slice;

//+ id :: _ -> _
fun.id = function(x) {
    return x;
};

////////////////////////////////////////////////////////////////////////////////
// type checking
////////////////////////////////////////////////////////////////////////////////

//+ isNull :: _ -> Boolean
fun.isNull = function(obj) {
    return obj === null;
};

//+ isDefined :: _ -> Boolean
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

//+ isNumber :: _ -> Boolean
fun.isNumber = function(n) {
    return (typeof n === 'number')
	&& !isNaN(parseFloat(n))
	&& isFinite(n);
};

////////////////////////////////////////////////////////////////////////////////
// Function
////////////////////////////////////////////////////////////////////////////////

//+ toArray :: a -> [b]
var toArray = function (arrish, n) {
    return typeof n === 'number' ?
	slice.call(arrish, n)
	: slice.call(arrish);
};

//- from wu.js <http://fitzgen.github.com/wu.js/>
//+ curry :: f -> _ ... -> g
var curry = function (fn) {
    var args = toArray(arguments, 1);
    return function () {
	return fn.apply(this, args.concat(toArray(arguments)));
    };
};

//- from wu.js <http://fitzgen.github.com/wu.js/>
//+ autoCurry :: Function -> Function
var autoCurry = function (fn, numArgs) {
    var expectedArgs = numArgs || fn.length;
    return function () {
        if (arguments.length < expectedArgs) {
            return expectedArgs - arguments.length > 0 ?
                autoCurry(curry.apply(this, [fn].concat(toArray(arguments))),
                          numArgs - arguments.length) :
                curry.apply(this, [fn].concat(toArray(arguments)));
        }
        else {
            return fn.apply(this, arguments);
        }
    };
};

Function.prototype.autoCurry = function(n) {
    return autoCurry(this, n);
};

//+ compose :: f -> g -> h 
fun.compose = function () {
    var fns = toArray(arguments), numFns = fns.length;
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

////////////////////////////////////////////////////////////////////////////////
// Array
////////////////////////////////////////////////////////////////////////////////

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
    return xs.length ? slice.call(xs, 1) : [];
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

fun.find = function(f, xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
	var x = xs[i];
	if (f(x)) return x;
    }
    return undefined;
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

//+ join :: String -> Array -> String
fun.join = function(string, xs) {
    return xs.join(string);
}.autoCurry();

//+ slice :: Int -> Int -> Array -> Array
fun.slice = function(lb, ub, xs) {
    return xs.slice(lb, ub);
}.autoCurry();

//+ indexOf :: [a] -> a -> Int
fun.indexOf = function(x, xs) {
    return xs.indexOf(x);
}.autoCurry();

//+ lastIndexOf :: [a] -> a -> Int
fun.lastIndexOf = function(x, xs) {
    return xs.lastIndexOf(x);
}.autoCurry();

////////////////////////////////////////////////////////////////////////////////
// Object
////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
// Logic
////////////////////////////////////////////////////////////////////////////////

//+ and :: _ ... -> Boolean
fun.and = function () {
    var args = slice.call(arguments);
    return function () {
	return reduce(function(acc, v) {
	    return acc && v;
	}, true, args.concat(slice.call(arguments)));
    };
}.autoCurry();

//+ or :: _ ... -> Boolean
fun.or = function () {
    var args = slice.call(arguments);
    return function () {
	return reduce(function(acc, v) {
	    return acc || v;
	}, false, args.concat(slice.call(arguments)));
    };
}.autoCurry();

//+ not :: _ -> Boolean
fun.not = function(x) {
    return !x;
};

////////////////////////////////////////////////////////////////////////////////
// Comparison
////////////////////////////////////////////////////////////////////////////////

//+ equal :: a -> a -> Boolean
// Note: type coercion
fun.equal = function (x, y) {
    return x == y;
}.autoCurry();

//+ identical :: a -> a -> Boolean
// Note: no type coercion
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

////////////////////////////////////////////////////////////////////////////////
// Number
////////////////////////////////////////////////////////////////////////////////

//+ incr :: Int -> Int
fun.incr = function(x) {
    return typeof x === 'number' ? x + 1 : undefined;
};

//+ decr :: Int -> Int
fun.decr = function(x) {
    return typeof x === 'number' ? x - 1 : undefined;
};

//+ min :: Number ... -> Number
fun.min = function() {
    return Math.min.apply(null, arguments);
};

//+ max :: Number ... -> Number
fun.max = function() {
    return Math.max.apply(null, arguments);
};

//+ pow :: Number ... -> Number
fun.pow = function(exponent, base) {
    return Math.pow(base, exponent);
}.autoCurry();

////////////////////////////////////////////////////////////////////////////////
// String
////////////////////////////////////////////////////////////////////////////////

//+ strcat :: String -> String -> String
fun.strcat = function(s, t) {
    return t.concat(s);
}.autoCurry();

// not yet implemented in node v0.10.0
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

////////////////////////////////////////////////////////////////////////////////
// RegExp
////////////////////////////////////////////////////////////////////////////////



// Make functions globally available as properties of an object
// (e.g. -- window, global)
fun.globalize = function(globalObj) {
    [
	"id"
	, "isNull"
	, "isDefined"
	, "isNumber"
	, "isArray"
	, "isObject"
	, "map"
	, "filter"
	, "reduce"
	, "reduceRight"
	, "zip"
	, "join"
	, "slice"
	, "compose"
	, "pluck"
	, "has"
	, "instanceOf"
	, "flip"
	, "and"
	, "or"
	, "not"
	, "empty"
	, "head"
	, "tail"
	, "find"
	, "any"
	, "all"
	, "indexOf"
	, "lastIndexOf"
	, "equal"
	, "identical"
	, "gt"
	, "gte"
	, "lt"
	, "lte"
	, "incr"
	, "decr"
	, "min"
	, "max"
	, "pow"
	, "strcat"
	// , "contains"
	// , "endsWith"
	, "match"
	, "replace"
	, "search"
	, "split"
	, "substr"
	, "toLower"
	, "toUpper"
	, "trim"
	, "trimRight"
	, "trimLeft"
    ].map(function(prop) {
	globalObj[prop] = fun[prop];
    });
};

module.exports = fun;