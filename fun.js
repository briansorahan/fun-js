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
    var If = fun.If;

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
        if (! fun.isObject(desc)) {
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
     *     // => "greet/1 introduce/2"
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
    Iface.Empty     = new Iface({});
    Iface.EmptyDesc = {};

    //+ ParseIfaceDescFrom :: String -> Object
    //! Generate an Object suitable for passing to the Iface
    //! constructor by parsing a string.
    function ParseIfaceDescFrom(s) {
        if (typeof s !== "string") {
            return new Error("Iface.parse only accepts strings");
        }

        var len = s.length;

        if (len === 0) {
            // if it is the empty string
            return Iface.EmptyDesc;
            // return Iface.Empty;
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

            return desc;
        }
    }

    /*
     * Parse an Iface from any number of strings.
     * Example:
     *     var Person = Iface.parse("sleepsFor/1 eats/1 breathes/1");
     *     // is equivalent to
     *     var Person = Iface.parse("sleepsFor/1",
     *                              "eats/1",
     *                              "breathes/1");
     */
    Iface.parse = function() {
        var args = Array.prototype.slice.call(arguments);
        var merged = args.reduce(function(acc, s) {
            var o = ParseIfaceDescFrom(s);
            return o === Iface.EmptyDesc ? acc : fun.merge(acc, o);
        }, {});
        return new Iface(merged);
    };

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
     *
     * @param {Object} obj - The object that implements the Iface.
     * @return {Object} The object that was provided, if it passes the check method.
     * @throw {TypeError} If the provided object does not implement the interface.
     */
    Iface.prototype.instance = function(obj) {
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
        if (! fun.isObject(desc)) {
            throw new Error("Iface constructor expects an object");
        }
        return new Iface(desc);
    };

    //+ Iface.parse :: String -> Iface
    fun.Iface.parse = Iface.parse;
    //+ data IFace.Empty
    fun.Iface.Empty = Iface.Empty;
    //+ isIface :: Object -> Boolean
    fun.isIface = fun.instanceOf(Iface);

    //+ instance :: [Iface] -> Object -> Object
    //! Throws an Error if the 2nd param does not implement all
    //! interfaces provided in the first param.
    //! If all the interfaces from the first param are implemented properly,
    //! returns the 2nd param.
    var instance = fun.instance = function(ifaces, obj) {
        if (fun.not(fun.isArray(ifaces)) || (ifaces.length === 0))
            throw new Error("instance expects a nonempty Array as first arg");
        if (! (fun.isObject(obj) && obj.hasOwnProperty("where") && fun.isObject(obj.where)))
            throw new Error("instance expects Object with a 'where' Object property as second arg");

        ifaces.forEach(function(iface, i) {
            if (! fun.isIface(iface))
                throw new Error("instance requires an Array of Iface's");

            if (! iface.check(obj.where)) {
                throw new Error("object does not implement interface " + i
                                + " from the first arg to instance");
            }
        });

        return obj.where;
    };

    //+ class Functor f where
    //+ fmap :: (a -> b) -> f a -> f b
    var Functor = fun.Functor = Iface.parse("fmap/1");

    //+ class Monad m where
    //+ ret  :: a -> m a
    //+ bind :: m a -> (a -> m b) -> m b
    var Monad = fun.Monad = Iface.parse("unit/1 bind/1");

    /*
     * Pattern matching according to the following rules:
     * For Iface match with isa.
     * For String match type-wise or with Regexp or identical.
     * For Number use identical.
     * For Array and Object use instanceof, then strictDeepEqual.
     * For Infinity, null, undefined use identical.
     */
    var CaseMatch = fun.CaseMatch = function(pattern, val) {
        if (pattern instanceof Iface) {
            return fun.isa(pattern, val);
        } else if (fun.isFunction(pattern)) {
            return pattern(val);
        } else if (fun.isRegexp(pattern) && fun.isString(val)) {
            return pattern.test(val);
        } else if (fun.isArray(val) && pattern !== Array) {
            return fun.strictDeepEqual(pattern, val);
        } else if (fun.isObject(pattern) && pattern !== Object) {
            return fun.strictDeepEqual(pattern, val);
        } else if (fun.isInfinity(val)) {
            return fun.isInfinity(pattern);
        } else {
            return (typeof val === pattern)
                || (fun.isFunction(pattern) && (val instanceof pattern))
                || val === pattern
                || val == pattern;
        }
    };

    fun.Otherwise = {};

    /*
     * see
     * http://stackoverflow.com/questions/203739/why-does-instanceof-return-false-for-some-literals
     * for a good description of some of the things you need to be careful of
     * when trying to match using instanceOf
     */
    var Match = fun.Match = function() {
        var args = Array.prototype.slice.call(arguments),
            nargs = args.length;

        if (! fun.even(nargs))
            throw new Error("all patterns in a Match must have a corresponding expression");
        // else
        //     console.log(nargs);

        function TestCase(val, patterns) {
            var pattern = patterns[0], expr = patterns[1];

            if (pattern === fun.Otherwise || fun.CaseMatch(pattern, val)) {
                return expr;
            } else if (patterns.length < 2) {
                return fun.Match.Fail;
            } else {
                return TestCase(val, fun.drop(2, patterns));
            }
        }

        return function(val) {
            return nargs < 2 ? fun.Match.Fail : TestCase(val, args);
        };
    };

    fun.Match.Fail = {};

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
    fun.snd = function(a, b) {
        if (fun.isPair(a) && (typeof b === "undefined")) {
            return a.second();
        } else {
            return b;
        }
    };

    // data Maybe a = Nothing | Just a
    var Maybe = fun.Maybe = Iface.parse("isNothing fmap/1 unit/1 bind/1");

    var Nothing = fun.Nothing = fun.Maybe.instance({
        isNothing: function()     { return true; },
        // instance Functor where
        fmap:      function(f)    { return Nothing; },
        // instance Monad where
        unit:      function(a)    { return Nothing; },
        bind:      function(f)    { return Nothing; }
    });

    // We map the javascript values undefined and null
    // to Nothing.
    var Just = fun.Just = function(val) {
        return fun.Maybe.instance({
            val:       function()     { return val; },
            isNothing: function()     { return false; },
            // instance Functor where
            fmap:      function(f)    { return Just(f(val)); },
            // instance Monad where
            unit: function(a)    {
                return If(fun.isDefined(a) && (! fun.isNull(a)))
                    .Then(Just(a))
                    .Else(Nothing);
            },
            // HACK: don't expect client code to return a Maybe value,
            //       just wrap it for them
            bind:      function(f)    { return f(val); }
        });
    };

    //+ fromMaybe :: a -> Maybe a -> a
    //! Takes a default value and a value wrapped in Maybe.
    //  If the Maybe is Nothing it returns the default value.
    //  If the Maybe is Just a, return a.
    fun.fromMaybe = function(d, maybe) {
        return fun.If(maybe.isNothing())
            .Then(d)
            .Else(maybe.val());
    }.autoCurry();

    //+ data Either a b = Left a | Right b

    var Either = Iface.parse("val isLeft fmap/1 unit/1 bind/1");

    // Data constructors
    fun.Left  = function(val) {
        return fun.instance([ fun.Functor, fun.Monad ], {
            where: {
                val:    function()  { return val; },
                isLeft: function()  { return true; },
                unit:   function(a) { return fun.Left(a); },
                fmap:   function(f) { return self; },
                bind:   function(f) { return fun.Left(val); }
            }
        });
    };

    fun.Right = function(val) {
        return {
            val:    function()  { return val; },
            isLeft: function()  { return false; },
            fmap:   function(f) { return fun.Right(f(val)); },
            bind:   function(f) { return f(val); }
        };
    };

    //+ either :: (a -> c) -> (b -> c) -> Either a b -> c
    fun.either = function(f, g, obj) {
        if ((! fun.isFunction(f)) || (! fun.isFunction(g)))
            throw new Error("either requires the first two arguments to be functions");

        return obj.isLeft() ? f(obj.val()) : g(obj.val());
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

    fun.IO = function(val) {
        return fun.Iface( fun.instance( [fun.Functor, fun.Monad], {
            where: {
                fmap: function(f) { return fun.IO(f(val)); },
                unit: function(a) { return fun.IO(a); },
                bind: function(f) { return f(val); }
            }
        }));
    };

    var Promise = function(val) {
    };

    function Emitter() {
        this._listeners = {};
    }

    Emitter.prototype.on = function(eventName, listener) {
        var self = this;
        self._listeners[eventName] = listener;
    };

    Emitter.prototype.emit = function(eventName) {
        var self = this,
            l = self._listeners[eventName],
            args = Array.prototype.slice.call(arguments, 1);
        if (fun.isFunction(l)) {
            l.apply(self, args);
        }
    };

    fun.Emitter = Emitter;

    fun.on = function(emitter, eventName, listener) {
        if (! fun.instanceOf(Emitter, emitter))
            throw new Error("on requires first argument to be an instance of Emitter");
        emitter.on(eventName, listener);
        return emitter;
    }.autoCurry();

    fun.emit = function(emitter, eventName, value) {
        if (! fun.instanceOf(Emitter, emitter))
            throw new Error("on requires first argument to be an instance of Emitter");
        var args = [eventName].concat(Array.prototype.slice.call(arguments, 2));
        emitter.emit.apply(emitter, args);
        return emitter;
    }.autoCurry();

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

fun.Iter = fun.Iface.parse("done next");

//+ iterate :: (a -> a) -> a -> [a]
//! Returns a LazyList of repeated applications of f to x
fun.iterate = function(f, x) {
    return fun.Iter.instance({
        val:  function()  { return x; },
        next: function() { return fun.iterate(f, f(x)); },
        done: function() { return false; }
    });
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
    if (! (fun.isFunction(p) && fun.isArray(xs)))
        throw new Error("dropWhile expects a Function and an Array");

    if (fun.empty(xs)) {
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
