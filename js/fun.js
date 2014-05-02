/**
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

fun.echo = function(x) {
    return function() { return x; };
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

//+ isObject :: _ -> Boolean
fun.isObject = function(obj) {
    return ((typeof obj === "object") && (! fun.isArray(obj)));
};

//+ isFunction :: _ -> Boolean
fun.isFunction = function(f) {
    return typeof f === "function";
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

//+ isInteger :: _ -> Boolean
fun.isInteger = function(n) {
    return fun.isNumber(n) && Math.floor(n) === n;
};

fun.If = function(p) {
    return {
        Then: function(f) {
            return {
                Else: function(g) {
                    if (p) {
                        return fun.isFunction(f) ? f() : f;
                    } else {
                        return fun.isFunction(g) ? g() : g;
                    }
                }
            };
        }
    };
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

var deepEqualWith = function(cmp) {
    var deqw = function(a, b) {
        if (fun.isArray(a)) {
            if (! fun.isArray(b)) return false;

            return a.length === b.length && a.every(function(el, i) {
                return deqw(el, b[i]);
            });
        } else if (fun.isNonNullObject(a)) {
            if (! fun.isNonNullObject(b)) return false;

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
// Object
////////////////////////////////////////

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

//+ isa :: Iface -> Object -> Boolean
fun.isa = function(type, obj) {
    return type.check(obj);
}.autoCurry();

//+ isnota :: String -> Object -> Boolean
fun.isnota = fun.compose(fun.not, fun.isa);

//+ objMap :: (String -> a -> b) -> Object -> [b]
//! map over key/value pairs in an object
fun.objMap = function(f, obj) {
	var result = [], index = 0;

    if (fun.isNonNullObject(obj) || fun.isFunction(obj)) {
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

    if (fun.isNonNullObject(obj) || fun.isFunction(obj)) {
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
    } else if (fun.isNonNullObject(obj) || fun.isFunction(obj)) {
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

fun.add = function(x, y) {
    return x + y;
}.autoCurry();

fun.multiply = function(x, y) {
    return x * y;
}.autoCurry();

fun.divide = function(dividend, divisor) {
    return dividend / divisor;
}.autoCurry();

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

// Types
(function() {
    /*
     * If you're wondering why I only go up to functions with
     * 10 parameters here, please see Perlisisms #11 at
     * http://www.cs.yale.edu/homes/perlis-alan/quotes.html
     * 
     * These are used in Iface.parse below.
     */
    var FunctionWithArity = [
        function()                    {},
        function(a)                   {},
        function(a,b)                 {},
        function(a,b,c)               {},
        function(a,b,c,d)             {},
        function(a,b,c,d,e)           {},
        function(a,b,c,d,e,f)         {},
        function(a,b,c,d,e,f,g)       {},
        function(a,b,c,d,e,f,g,h)     {},
        function(a,b,c,d,e,f,g,h,i)   {},
        function(a,b,c,d,e,f,g,h,i,j) {}
    ];

    // string that separates function name from arity in
    // Iface.toString and Iface.parse
    var aritySeparator   = "/";
    // string that separates function name/arity strings in
    // Iface.toString and Iface.parse
    var functionSeparator    = " ";

    // private Iface constructor
    function Iface(desc) {
        if (! fun.isNonNullObject(desc)) {
            throw new Error("Iface constructor requires an object");
        }
        if (! fun.isFunction(fun.functions)) {
            throw new Error("fun.functions has not been defined yet");
        }
        // cache an object with just the functions of desc
        this._methods = fun.functions(desc);
    }

    /*
     * Convert an Iface to a string.
     * 
     * Example:
     *     var Person = Iface({
     *         greet: function(person) {},
     *         introduce: function(p1, p2) {}
     *     });
     * 
     *     Person.toString();
     *     // => "greet,1_&_introduce,2"
     */
    Iface.prototype.toString = function() {
        return fun.objMap(function(k, v) {
            return k + aritySeparator + v.length;
        }, this._methods).join(functionSeparator);
    };

    /*
     * Class method to parse an Iface from a string.
     * Returns Iface.ParseError if it cannot parse the string.
     * 
     * Example:
     *     var PersonFromString = Iface.parse("greet,1_&_introduce,2");
     *     // equivalent to
     *     
     */
    Iface.parse = (function() {
        var cache = {};

        return function(s) {
            if (typeof s !== "string") {
                return new Error("Iface.parse only accepts strings");
            }
            
            if (! cache.hasOwnProperty(s)) {
                var len = s.length;

                if (len === 0) {
                    // if it is the empty string
                    cache[s] = new Iface({});
                } else {
                    var fs = s.split(functionSeparator);

                    // parse the string and cache the result
                    var desc = fs.reduce(function(acc, str) {
                        var arsepIndex = str.indexOf(aritySeparator);

                        if (arsepIndex > 0 && arsepIndex < len - 1) {
                            // "<name>,<arity>"
                            var f_parts   = str.split(aritySeparator);
                            var f_name    = f_parts[0];
                            var f_arity   = parseInt(f_parts[1], 10);

                            if (isNaN(f_arity)) {
                                throw new Error("Could not parse function arity from " + str);
                            } else if (f_arity > 10) {
                                throw new Error("Iface.parse does not support functions with arity > 10");
                            }

                            // console.log("parsed function " + f_name + " with arity " + f_arity);
                            acc[f_name] = FunctionWithArity[f_arity];
                        } else if (arsepIndex === 0) {
                            // ",<arity>"
                            throw new Error("Iface.parse does not support empty function names");
                        } else {
                            // "<name>," or "<name>"
                            acc[str] = FunctionWithArity[0];
                        }
                        
                        return acc;
                    }, {});

                    cache[s] = new Iface(desc);
                }
            }

            return cache[s];
        };
    })();

    function arity(f) { return f.length; }

    /**
     * Duck-type an object to see if it implements an interface.
     * @param {Object} obj - The object under inspection.
     * @return {Boolean} true if the object implements this interface, false otherwise
     */
    Iface.prototype.check = function(obj) {
        var self = this,
            myFuncs = self._methods,
            myFuncNames = fun.keys(self._methods),
            objFuncs = fun.functions(obj),
            objFuncNames = fun.keys(objFuncs);
        
        if(! fun.isArray(myFuncNames)) {
            return false;
        } else if (! fun.isArray(objFuncNames)) {
            return false;
        } else {
            return myFuncNames.reduce(function(acc, m) {
                return acc &&
                    fun.isFunction(objFuncs[m]) &&
                    fun.identical(arity(myFuncs[m]), arity(objFuncs[m]));
            }, true);
        }
    };

    /**
     * Create a new implementation of an Iface.
     * @param {Object} obj - The object that implements the Iface.
     * @return {Object} The object that was provided, if it passes the check method.
     * @throw {TypeError} If the provided object does not implement the interface.
     */
    Iface.prototype.imp = function(obj) {
        if (this.check(obj)) {
            return obj;
        } else {
            throw new TypeError("Incomplete interface implementation.");
        }
    };

    /**
     * Create a new Iface.
     * @param {Object} desc - An object with functions that specify the interface.
     * @return {Iface} A new Iface instance.
     */
    fun.Iface = function(desc) {
        if (! fun.isNonNullObject(desc)) {
            throw new Error("Iface constructor expects an object");
        }
        return new Iface(desc);
    };

    fun.Iface.parse = Iface.parse;

    //+ class Functor f where
    //+     fmap :: (a -> b) -> f a -> f b    
    fun.Functor = Iface.parse("fmap/1");
    //+ class Monad m where
    //+     ret  :: a -> m a
    //+     bind :: m a -> (a -> m b) -> m b
    fun.Monad = Iface.parse("ret bind/2");

    // Pair
    var Pair = function(x, y) {
        this.x = x;
        this.y = y;
    };

    Pair.prototype.first = function() {
        return this.x;
    };

    Pair.prototype.second = function() {
        return this.y;
    };

    // Pair data constructor
    fun.Pair = function(x, y) {
        return new Pair(x, y);
    }.autoCurry();

    //+ isPair :: _ -> Boolean
    fun.isPair = function(x) {
        return x instanceof Pair;
    };

    //+ fst :: Pair a b -> a
    fun.fst = function(a, b) {
        if (fun.isPair(a) && (typeof b === "undefined")) {
            return a.first();
        } else {
            return a;
        }
    };

    //+ snd :: (a -> b -> c) -> a
;    fun.snd = function(a, b) {
        if (fun.isPair(a) && (typeof b === "undefined")) {
            return a.second();
        } else {
            return b;
        }
    };

    // data Maybe a = Nothing | Just a
    fun.Maybe = Iface.parse("isNothing fmap/1 ret bind/2");

    fun.Nothing = function(val) {
        return fun.Maybe.imp({
            isNothing: function()     { return true; },
            fmap:      function(f)    { return fun.Nothing; },
            ret:       function()     { return fun.Nothing; },
            bind:      function(a, f) { return fun.Nothing; }
        });
    };

    // We map the javascript values undefined and null
    // to Nothing.
    fun.Just = function(val) {
        if (! fun.isDefined(val)) {
            return fun.Nothing(val);
        } else if (fun.isNull(val)) {
            return fun.Nothing(val);
        } else {
            return fun.Maybe.imp({
                isNothing: function()     { return false; },
                fmap:      function(f)    { return fun.Just(f(val)); },
                ret:       function()     { return val; },
                bind:      function(a, f) { return fun.Maybe.imp(f(a)); }
            });
        }
    };

    //+ fromMaybe :: a -> Maybe a -> a
    //! Takes a default value and a value wrapped in Maybe.
    //  If the Maybe is Nothing it returns the default value.
    //  If the Maybe is Just a, return a.
    fun.fromMaybe = function(d, maybe) {
        return fun.If(maybe.isNothing()).Then(d).Else(maybe.ret());
    }.autoCurry();

    //+ data Either a b = Left a | Right b

    var Either = {
        Iface: Iface.parse("val isLeft fmap/1"),
        Undefined: {}
    };

    // Data constructors
    fun.Left  = function(val) {
        var self = {
            val:    function()  { return val; },
            isLeft: function()  { return true; },
            fmap:   function(f) { return self; }
        };

        return self;
    };

    fun.Right = function(val) {
        return {
            val:    function()  { return val; },
            isLeft: function()  { return false; },
            fmap:   function(f) { return fun.Right(f(val)); }
        };
    };

    //+ either :: (a -> c) -> (b -> c) -> Either a b -> c
    fun.either = function(f, g, obj) {
        if ((! fun.isFunction(f)) || (! fun.isFunction(g))) {
            return Either.Undefined;
        } else {
            return obj.isLeft() ? f(obj.val()) : g(obj.val());
        }
    }.autoCurry();

    fun.lefts = function(array) {
        if (! fun.isArray(array)) {
            return Either.Undefined;
        } else {
            return array.reduce(function(acc, el) {
                return el.isLeft() ? acc.concat(el.val()) : acc;
            }, []);
        }
    };

    fun.rights = function(array) {
        if (! fun.isArray(array)) {
            return Either.Undefined;
        } else {
            return array.reduce(function(acc, el) {
                return el.isLeft() ? acc : acc.concat(el.val());
            }, []);
        }
    };
        
})();

//+ fmap :: (a -> b) -> f a -> f b
fun.fmap = function(f, functor) {
    return fun.isa(fun.Functor, functor) ? functor.fmap(f) : undefined;
}.autoCurry();

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

//+ last :: [a] -> a
fun.last = function(xs) {
    return fun.isArray(xs) ? (xs.length ? xs.slice(-1)[0] : []) : undefined;
};

//+ tail :: [a] -> a
fun.tail = function(xs) {
    return fun.isArray(xs) ? (xs.length ? xs.slice(1) : []) : undefined;
};

//+ init :: [a] -> [a]
fun.init = function(xs) {
    return fun.isArray(xs) ? (xs.length ? xs.slice(0, -1) : []) : undefined;
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

//+ zip :: [a] -> [b] -> [ Pair a b ]
fun.zip = function(xs, ys) {
    if (! (fun.isArray(xs) && fun.isArray(ys))) {
        return undefined;
    } else if (fun.empty(xs) || fun.empty(ys)) {
        return [];
    } else if (xs.length > ys.length) {
        return ys.reduce(function(acc, y, i) {
            return acc.concat(fun.Pair(xs[i], y));
        }, []);
    } else {
        return xs.reduce(function(acc, x, i) {
            return acc.concat(fun.Pair(x, ys[i]));
        }, []);
    }
}.autoCurry();

//+ zipWith :: (a -> b -> _) -> [a] -> [b] -> _
fun.zipWith = function(f, xs, ys) {
    var len = Math.min(xs.length, ys.length);
    var result = [];
    for (var i = 0; i < len; i++) {
	    result[i] = f(xs[i], ys[i]);
    }
    return result;
}.autoCurry();

//+ unzip :: [ Pair a b ] -> Pair([a], [b])
fun.unzip = function(ps) {
    if (! fun.isArray(ps)) {
        return undefined;
    } else if (fun.empty(ps)) {
        return [];
    } else {
        var lists = ps.reduce(function(acc, p) {
            acc.as.push(fun.fst(p));
            acc.bs.push(fun.snd(p));
            return acc;
        }, { as: [], bs: [] });
        return fun.Pair(lists.as, lists.bs);
    }
};

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

//+ splitAt :: Int -> [a] -> Pair [a] [a]
fun.splitAt = function(n, xs) {
    if (! (fun.isNumber(n) && fun.isArray(xs))) {
        return undefined;
    } else if (fun.empty(xs)) {
        return [];
    } else {
        return fun.Pair(fun.take(n, xs), fun.drop(n, xs));
    }
}.autoCurry();

//+ takeWhile :: (a -> Boolean) -> [a] -> [a]
fun.takeWhile = function(p, xs) {
    if (! (fun.isFunction(p) && fun.isArray(xs))) {
        return undefined;
    } else if (fun.empty(xs)) {
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
fun.dropWhile = function(p, xs) {
    if (! (fun.isFunction(p) && fun.isArray(xs))) {
        return undefined;
    } else if (fun.empty(xs)) {
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
fun.span = function(p, xs) {
    if (! (fun.isFunction(p) && fun.isArray(xs))) {
        return undefined;
    } else if (fun.empty(xs)) {
        return fun.Pair([], []);
    } else {
        var i;
        for (i = 0; i < xs.length; i++) {
            if (! p(xs[i])) {
                return fun.Pair(xs.slice(0, i), xs.slice(i));
            }
        }

        return fun.Pair(xs.slice(0), []);
    }
}.autoCurry();

// TODO
//+ objDiff :: _ -> _ -> Object
// fun.objDiff = function(a, b) {
// };

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

if (fun.isNodeJS()) {
    module.exports = fun;    
} else if (fun.isBrowser()) {
    window.fun = fun;
}
