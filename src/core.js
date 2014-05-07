/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 *
 * Notes
 *
 * - This module is the foundation of fun-js.
 * - All other modules in fun-js will probably want to require this one.
 * - This module should *never* require any other.
 */

// object which will get merged into module.exports
var ex = {};

//+ id :: _ -> _
ex.id = function(x) { return x; };

//+ isNull :: _ -> Boolean
ex.isNull = function(x) { return x === null; };
//+ isDefined :: _ -> Boolean
ex.isDefined = function(x) { return x !== undefined; };
//+ isArray :: _ -> Boolean
ex.isArray = function(x) { return Array.isArray(x); };
//+ isString :: _ -> Boolean
ex.isString = function(x) { return typeof x === "string" || x instanceof String; };
//+ isFunction :: _ -> Boolean
ex.isFunction = function(x) { return typeof x === "function"; };
//+ isInfinity :: _ -> Boolean
ex.isInfinity = function(x) { return x === Infinity; };

//+ isObject :: _ -> Boolean
ex.isObject = function(x) {
    return ex.isDefined(x) && !ex.isNull(x)
                           && !ex.isArray(x)
                           && (typeof x === "object");
};

//+ isNumber :: _ -> Boolean
ex.isNumber = function(x) {
    return ((typeof x === "number") && !isNaN(parseFloat(x))
                                    && isFinite(x))
        || (x instanceof Number);
};

//+ isInteger :: _ -> Boolean
ex.isInteger = function(x) {
    if (x instanceof Number) x = x.valueOf();
    return ex.isNumber(x) && Math.floor(x) === x;
};

//+ isRegexp :: _ -> Boolean
ex.isRegexp = function(x) {
    return (ex.isObject(x) && ex.isFunction(x.test)
                           && ex.isFunction(x.exec))
        || (x instanceof RegExp);
};

// arg :: _ -> _
ex.arg = function(n) {
    if (!ex.isInteger(n) || n < 0)
        throw new Error("arg expects a positive Integer");
    return function() {
        return arguments[n];
    };
};

//+ If   :: Boolean  -> Then
//+ Then :: Function -> {Elif|Else}
//+ Elif :: Function -> Else
//+ Else :: Function -> _
ex.If = function(p) {
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
ex.curry = function (fn) {
    if (!ex.isFunction(fn))
        throw new Error("curry expects a function as the first argument");
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
	    return fn.apply(fn, args.concat(Array.prototype.slice.call(arguments)));
    };
};

//- from wu.js <http://fitzgen.github.com/wu.js/>
//+ autoCurry :: Function -> Function
ex.autoCurry = function (fn, numArgs) {
    var expectedArgs = numArgs || fn.length;
    return function () {
        if (arguments.length < expectedArgs) {
            // A curried version of fn
            var curried = ex.curry.apply(this, [fn].concat(Array.prototype.slice.call(arguments)));
            var rem = numArgs - arguments.length;
            // If we still don't have the expected number of arguments,
            // return
            return expectedArgs - arguments.length > 0 ? ex.autoCurry(curried, rem) : curried;
        } else {
            return fn.apply(this, arguments);
        }
    };
};

Function.prototype.autoCurry = function(n) {
    return ex.autoCurry(this, n || this.length);
};

//+ compose :: f -> g -> h
ex.compose = function() {
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
ex.composer = function() {
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
ex.flip = function(f) {
    return function () {
	    return f(arguments[1], arguments[0]);
    };
};

//+ until :: (a -> Boolean) -> (a -> a) -> a -> a
//! until p f applies f until p holds
ex.until = function(p, f, x) {
    return p(x) ? x : ex.until(p, f, f(x));
}.autoCurry();

//+ equal :: a -> a -> Boolean
ex.equal = function (x, y) { return x == y; }.autoCurry();

//+ identical :: a -> a -> Boolean
ex.identical = function (x, y) { return x === y; }.autoCurry();

var deepEqualWith = function(cmp) {
    var deqw = function(a, b) {
        if (ex.isArray(a)) {
            if (! ex.isArray(b)) return false;

            return a.length === b.length && a.every(function(el, i) {
                return deqw(el, b[i]);
            });
        } else if (ex.isObject(a)) {
            if (! ex.isObject(b)) return false;

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
ex.deepEqual = deepEqualWith(ex.equal);

//+ strictDeepEqual :: _ -> _ -> Boolean
ex.strictDeepEqual = deepEqualWith(ex.identical);

//+ and :: _ ... -> Boolean
ex.and = function () {
    var args = Array.prototype.slice.call(arguments);
    return function () {
        var innerArgs = Array.prototype.slice.call(arguments);
	    return ex.reduce(function(acc, v) {
	        return acc && v;
	    }, true, args.concat(innerArgs));
    };
}.autoCurry();

//+ or :: _ ... -> Boolean
ex.or = function () {
    var args = Array.prototype.slice.call(arguments);
    return function () {
	return reduce(function(acc, v) {
	    return acc || v;
	}, false, args.concat(Array.prototype.slice.call(arguments)));
    };
}.autoCurry();

//+ not :: _ -> Boolean
ex.not = function(x) {
    return !x;
};

//+ pluck :: String -> Object -> _
ex.pluck = function (name, obj) {
    return obj[name];
}.autoCurry();

//+ dot :: Object -> String -> _
ex.dot = function(obj, name) {
    return obj[name];
}.autoCurry();

//+ has :: String -> Object -> Boolean
ex.has = function(name, obj) {
    return obj.hasOwnProperty(name);
}.autoCurry();

//+ instanceOf :: Object -> Object -> Boolean
ex.instanceOf = function(constructor, obj) {
    return obj instanceof constructor;
}.autoCurry();

ex.typeOf = function(T, val) {
    if (T.toLowerCase() === "object") {
        return ex.isObject(val);
    } else {
        return typeof val === T;
    }
}.autoCurry();

//+ isa :: Iface -> Object -> Boolean
ex.isa = function(iface, obj) {
    return iface.check(obj);
}.autoCurry();

//+ isnota :: String -> Object -> Boolean
ex.isnota = ex.compose(ex.not, ex.isa);

//+ objMap :: (String -> a -> b) -> Object -> [b]
//! map over key/value pairs in an object
ex.objMap = function(f, obj) {
	var result = [], index = 0;

    if (ex.isObject(obj) || ex.isFunction(obj)) {
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

ex.keys = ex.objMap(ex.arg(0));
ex.vals = ex.objMap(ex.arg(1));

//+ merge :: Object -> Object -> Object
// Note: Properties of the second argument take precedence
//       over identically-named properties of the first
//       argument.
ex.merge = function(obj1, obj2) {
	var result = {};
    [obj1, obj2].forEach(function(obj) {
        for (var p in obj) {
            if (ex.has(p, obj)) {
                result[p] = obj[p];
            }
        }
    });
    return result;
};

//+ reduceOwn :: Function -> Object -> Object
ex.reduceOwn = function(f, obj) {
    var wrapper = function(result, k) {
        f(result, k, obj[k]);
        return result;
    };

    if (ex.isObject(obj) || ex.isFunction(obj)) {
        return Object.getOwnPropertyNames(obj).reduce(wrapper, {});
    } else {
        return undefined;
    }
}.autoCurry();

//+ filterObject :: (Object -> String -> _ -> Boolean) -> Object -> Object
ex.filterObject = function(f, obj) {
    var pick = function(result, key, val) {
        if (f(result, key, val)) {
            result[key] = val;
        }
    };
    return ex.reduceOwn(pick, obj);
}.autoCurry();

//+ functions :: {Object|Array} -> [ {Object|Array} ]
//! Return an array of the function names of an object.
//  Returns undefined if the object is not an Object.
ex.functions = function(obj) {
    if (ex.isArray(obj)) {
        return obj.filter(ex.isFunction);
    } else if (ex.isObject(obj) || ex.isFunction(obj)) {
        var f = function(acc, key, val) {
            return ex.isFunction(val);
        };
        return ex.filterObject(f, obj);
    } else {
        return undefined;
    }
};



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
