/* -*- js3-indent-level: 4; -*-
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */

// exported global object
var fun = {};

//+ id :: _ -> _
fun.id = function(x) {
    return x;
};

fun.arg = function(n) {
    return function() {
        return arguments[n];
    };
};

////////////////////////////////////////
// type checking
////////////////////////////////////////

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

//+ isString :: _ -> Boolean
fun.isString = function(obj) {
    return typeof obj === "string";
};

//+ isFunction :: _ -> Boolean
fun.isFunction = function(f) {
    return typeof f === "function";
};

//+ isObject :: _ -> Boolean
fun.isObject = function(obj) {
    return obj !== undefined
        && obj !== null
        && (! fun.isArray(obj))
        && (typeof obj === "object");
};

//+ isNumber :: _ -> Boolean
fun.isNumber = function(n) {
    return (typeof n === 'number')
	    && !isNaN(parseFloat(n))
	    && isFinite(n);
};

//+ isInteger :: _ -> Boolean
fun.isInteger = function(n) {
    return fun.isNumber(n) && Math.floor(n) === n;
};

//+ isInfinity :: _ -> Boolean
fun.isInfinity = function(n) {
    return n === Infinity;
};

//+ isRegexp :: _ -> Boolean
fun.isRegexp = function(obj) {
    return fun.isObject(obj)
        && fun.isFunction(obj.test)
        && fun.isFunction(obj.exec);
};

//+ If   :: Boolean  -> Then
//+ Then :: Function -> {Elif|Else}
//+ Elif :: Function -> Else
//+ Else :: Function -> _
fun.If = function(p) {
    var Then = function(condition) {
        return function(f) {
            return {
                Elif: function(q) {
                    return {
                        Then: Then(q)
                    };
                },
                Else: function(g) {
                    return condition ? f : g;
                }
            };
        };
    };

    return {
        Then: Then(p)
    };
};

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
    return autoCurry(this, n || this.length);
};

//+ compose :: f -> g -> h
fun.compose = function() {
    var fns = Array.prototype.slice.call(arguments), numFns = fns.length;
    return function () {
        var i, returnValue = fns[numFns -1].apply(this, arguments);
        for (i = numFns - 2; i > -1; i--) {
            returnValue = fns[i](returnValue);
        }
        return returnValue;
    };
}.autoCurry();

//+ composer :: f -> g -> h
//! Just like compose, but with the order reversed.
fun.composer = function() {
    var fns = Array.prototype.slice.call(arguments), numFns = fns.length;
    return function () {
        var i, returnValue = fns[0].apply(this, arguments);
        for (i = 1; i < numFns; i++) {
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

//+ until :: (a -> Boolean) -> (a -> a) -> a -> a
//! until p f applies f until p holds
fun.until = function(p, f, x) {
    return p(x) ? x : fun.until(p, f, f(x));
}.autoCurry();

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

var deepEqualWith = function(cmp) {
    var deqw = function(a, b) {
        if (fun.isArray(a)) {
            if (! fun.isArray(b)) return false;

            return a.length === b.length && a.every(function(el, i) {
                return deqw(el, b[i]);
            });
        } else if (fun.isObject(a)) {
            if (! fun.isObject(b)) return false;

            var aprops = Object.getOwnPropertyNames(a);
            var bprops = Object.getOwnPropertyNames(b);

            return aprops.length === bprops.length && aprops.reduce(function(acc, p) {
                return acc && b.hasOwnProperty(p) && deqw(a[p], b[p]);
            }, true);
        } else {
            return cmp(a, b);
        }
    }.autoCurry();

    return deqw;
};

//+ deepEqual :: _ -> _ -> Boolean
fun.deepEqual = deepEqualWith(fun.equal);

//+ strictDeepEqual :: _ -> _ -> Boolean
fun.strictDeepEqual = deepEqualWith(fun.identical);

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

//+ pluck :: String -> Object -> _
fun.pluck = function (name, obj) {
    return obj[name];
}.autoCurry();

//+ dot :: Object -> String -> _
fun.dot = function(obj, name) {
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

fun.typeOf = function(T, val) {
    if (T.toLowerCase() === "object") {
        return fun.isObject(val);
    } else {
        return typeof val === T;
    }
}.autoCurry();

//+ isa :: Iface -> Object -> Boolean
fun.isa = function(iface, obj) {
    return iface.check(obj);
}.autoCurry();

//+ isnota :: String -> Object -> Boolean
fun.isnota = fun.compose(fun.not, fun.isa);

//+ objMap :: (String -> a -> b) -> Object -> [b]
//! map over key/value pairs in an object
fun.objMap = function(f, obj) {
	var result = [], index = 0;

    if (fun.isObject(obj) || fun.isFunction(obj)) {
	    for (var property in obj) {
		    if (obj.hasOwnProperty(property)) {
			    result[index++] = f(property, obj[property]);
		    }
	    }
	    return result;
    } else {
        return undefined;
    }
}.autoCurry();

fun.keys = fun.objMap(fun.arg(0));
fun.vals = fun.objMap(fun.arg(1));

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

    if (fun.isObject(obj) || fun.isFunction(obj)) {
        return Object.getOwnPropertyNames(obj).reduce(wrapper, {});
    } else {
        return undefined;
    }
}.autoCurry();

//+ filterObject :: (Object -> String -> _ -> Boolean) -> Object -> Object
fun.filterObject = function(f, obj) {
    var pick = function(result, key, val) {
        if (f(result, key, val)) {
            result[key] = val;
        }
    };
    return fun.reduceOwn(pick, obj);
}.autoCurry();

//+ functions :: {Object|Array} -> [ {Object|Array} ]
//! Return an array of the function names of an object.
//  Returns undefined if the object is not an Object.
fun.functions = function(obj) {
    if (fun.isArray(obj)) {
        return obj.filter(fun.isFunction);
    } else if (fun.isObject(obj) || fun.isFunction(obj)) {
        var f = function(acc, key, val) {
            return fun.isFunction(val);
        };
        return fun.filterObject(f, obj);
    } else {
        return undefined;
    }
};

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

//+ divide :: Number -> Number -> Number
fun.add = function(x, y) {
    return x + y;
}.autoCurry();

//+ divide :: Number -> Number -> Number
fun.multiply = function(x, y) {
    return x * y;
}.autoCurry();

//+ divide :: Number -> Number -> Number
fun.divide = function(dividend, divisor) {
    return dividend / divisor;
}.autoCurry();

//+ pow :: Number ... -> Number
fun.pow = function(exponent, base) {
    return Math.pow(base, exponent);
}.autoCurry();

//+ rem :: Number -> Number -> Number
//! computes remainder of m / n
fun.rem = function(m, n) {
    if (! (fun.isInteger(m) && fun.isInteger(n))) {
        throw new Error("rem expects integers");
    }
    return m < n ? m : (m == n ? 0 : m - (n * Math.floor(m / n)));
};

//+ even :: Integer -> Boolean
fun.even = function(n) {
    if (! fun.isInteger(n))
        return false;
    else if (fun.rem(n, 2) == 0)
        return true;
    else
        return false;
};

fun.odd = fun.compose(fun.not, fun.even);

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

// Types
(function() {
})();

//+ fmap :: (a -> b) -> f a -> f b
fun.fmap = function(f, functor) {
    if (! fun.isa(fun.Functor, functor))
        throw new Error("fmap requires a Functor as its 2nd argument");
    else
        return fun.isa(fun.Functor, functor) ? functor.fmap(f) : undefined;
}.autoCurry();

////////////////////////////////////////
// Array
////////////////////////////////////////


//+ strcat :: String -> String -> String
fun.strcat = function(s, t) {
    return t.concat(s);
}.autoCurry();

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

//+ parseJSON :: Either Error {Object|Array}
fun.parseJSON = function(s) {
    try {
        return fun.Right(JSON.parse(s));
    } catch (err) {
        return fun.Left(err);
    }
};

//+ stringify :: Either Error String
fun.stringify = function(val) {
    try {
        return fun.Right(JSON.stringify(val));
    } catch (err) {
        return fun.Left(err);
    }
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
    options = options || {};

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
     * (1) It is in 'without' or
     * (2) It is not in 'select' and 'select' is nonempty.
     * Note that all functions are imported if both 'select' and 'without' are empty.
     */
	fun.objMap(function(k, v) {
		if (fun.isObject(namespace) && k !== "import") {
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

if (fun.isNodeJS()) {
    // any node.js specific stuff we may want to include
    var fun_http = require("./fun-http.js");
    fun_http.augment(fun);
    module.exports = fun;
} else if (fun.isBrowser()) {
    window.fun = fun;
}
