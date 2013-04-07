var prelude = {} // create "prelude" namespace
, oldPrelude = {}

// Detect free variables "exports" and "global", for applying
// different module load/require patterns in different environments
, freeExports = typeof exports == 'object' && exports
, freeGlobal = typeof global == 'object' && global

// Require the functional lib if in Node.js environment
, functional = require('functionaljs')

// Helpers
//+ equals :: a -> a -> Bool
, equals = function(x, y) {
    return x === y;
}.autoCurry()

//+ isArray :: a -> Boolean
, isArray = function(obj) {
    return (obj && obj.constructor == Array);
}

//+ isObj :: a -> Boolean
, isObj = function(obj) {
    return (typeof obj == "object" && !isArray(obj));
}

//+ isNumber :: a -> Boolean
, isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//+ nTimes :: Integer -> (-> a) -> [a]
, nTimes = function(times, fun) {
    var result = [];
    for(var i=0;i<times;i++ ){ result = cons(fun(), result); }
    return result;
}.autoCurry()

//+ log :: a -> a
, log = function(what) {
    console.log(what);
    return what;
}

//+ log2 :: String -> a -> a
, log2 = function(one, two) {
    log(one);
    return log(two);
}.autoCurry()



// Array
//+ take :: Integer -> [a] -> [a]
, take = function(n, xs) {
    return xs.slice(0, n);
}.autoCurry()

//+ drop :: Integer -> [a] -> [a]
, drop = function(n, xs) {
    return xs.slice(n, xs.length);
}.autoCurry()

//+ unshift :: [a] -> b -> [b,a]
, unshift = function(xs, x) {
    return x.concat(xs);
}.autoCurry()

//+ cons :: a -> [b] -> [a,b]
, cons = function(x, xs) {
    return [x].concat(xs);
}.autoCurry()

//+ concat :: [a] -> [b] -> [a,b]
, concat = function(xs, ys) {
    return xs.concat(ys);
}.autoCurry()

//+ first :: [a] -> a
, first = function(xs) {
    return xs[0];
}

//+ rest :: [a] -> [a] 
, rest = function(xs) {
    return (typeof xs == "string") ? xs.substr(1, xs.length) : xs.slice(1, xs.length);
}

//+ last :: [a] -> a
, last = function(xs) {
    return xs[xs.length -1];
}

//+ join :: String -> [String] -> String
, join = function(token, xs) {
    return xs.join(token);
}.autoCurry()

//+ groupsOf :: Integer -> [a] -> [[a]]
, groupsOf = function(n, xs) {
    if(!xs.length) return [];
    return cons(take(n, xs), groupsOf(n, drop(n,xs)));
}.autoCurry()

//+ zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
, zipWith = function(f, xs, ys) {
    f = f.toFunction();
    return xs.reduce(function(result, x, i){
		return result.concat(f(x, ys[i]));
    }, []);
}.autoCurry()

//+ uniq :: [a] -> [a] 
, uniq = function(xs) {
    var result = [];
    for(var i=0;i<xs.length;i++ ) { if(result.indexOf(xs[i]) < 0) result.push(xs[i]); };
    return result;
}

//+ uniqBy :: (a -> b) -> [a] -> [a]
, uniqBy = function(fun, xs) {
    var result = [], len = xs.length, fun = fun.toFunction();
    for(var i=0;i<len;i++ ) {
		if(functional.map(fun)(result).indexOf(fun(xs[i])) < 0) {
			result.push(xs[i]);
		}
    };
    return result;
}.autoCurry()

//+ reverse :: [a] -> [a]
, reverse = function(xs) {
    var mempty = (typeof xs == "string") ? "" : [];
    if(isArray(xs)) {
		//destructive
		return xs.reverse();
    } else {
		return functional.reduce(function(x, acc){ return acc.concat(x); }, mempty, xs);
    }
}.autoCurry()

//+ sort :: [a] -> [a]
, sort = function(xs) {
    //destructive
    is_num_array = reduce(andand, true, map(isNumber,xs));
    num_sort_func = function(a,b) {return a - b;};
    return is_num_array ? xs.sort(num_sort_func) : xs.sort();
}

//+ element :: [a] -> b -> Boolean
, element = function(arr, x) {
    return arr.indexOf(x) >= 0;
}.autoCurry()

//+ flatten :: [[a]] -> [a]
, flatten = functional.reduce(function(a,b){return a.concat(b);}, [])

//+ sortBy :: (a -> b) -> [a] -> [a]
, sortBy = function(fun, xs) {
    var _sortBy = function(iterator, xs, context) {
		return map('.value', map(function(value, index) {
			return {
				value: value,
				criteria: iterator.call(context, value, index)
			};
		}, xs).sort(function(left, right) {
			var a = left.criteria, b = right.criteria;
			return a < b ? -1 : a > b ? 1 : 0;
		}));
    }
    var f = fun.toFunction();
    return _sortBy(f, xs);
}.autoCurry()

//+ groupBy :: (a -> Boolean) -> [a] -> {false: [a], true: [a]}
, groupBy = function(fun, xs) {
    var f = fun.toFunction();
    var _makeHash = function(obj, x) {
		var val = f(x);
		if(!obj[val]) obj[val] = [];
		obj[val].push(x);
		return obj;
    }
    
    return reduce(_makeHash, {}, xs);
}.autoCurry()




// String
//+ strip :: String -> String
, strip = function(str) {
    return str.replace(/\s+/g, "");
}

//+ split :: String -> String -> [String]
, split = function(token, xs) {
    return xs.split(token);
}.autoCurry()

//+ test :: RegEx -> String -> Boolean
, test = function(expr, x) {
    return expr.test(x);
}.autoCurry()

//+ match :: RegEx -> String -> [] 
, match = function(expr, x) {
    return x.match(expr);
}.autoCurry()

//+ replace :: RegEx -> String -> String -> String
, replace = function(pattern, sub, str) {
    return str.replace(pattern, sub);
}.autoCurry()



// Conditional
//+ when :: Boolean -> (? -> a) -> a
, when = function(pred, f) {
    return function() {
		if(pred.apply(this, arguments)) return f.apply(this, arguments);
    }
}.autoCurry()

//+ ifelse :: (-> Boolean) -> (-> a) -> (-> b) -> a|b
, ifelse = function(pred, f, g) {
    return function() {
		return pred.apply(this, arguments) ? f.apply(this, arguments) : g.apply(this, arguments);
    }
}.autoCurry()

//+ negate :: Boolean -> Boolean
, negate = function(bool) {
    return !bool;
}

//+ andand :: a -> b -> Boolean
, andand = function(x, y) {
    return x && y;
}.autoCurry()

//+ oror :: a -> b -> Boolean
, oror = function(x, y) {
    return x || y;
}.autoCurry()



// Object
//+ setVal :: String -> Object -> a -> a
, setVal = function(attribute, x, val) {
    x[attribute] = val;
    return val;
}.autoCurry()

//+ getVal :: String -> Object -> a
, getVal = function(attribute, x) {
    return function(){ return x[attribute]; };
}.autoCurry()

//+ merge :: Object -> Object -> Object
, merge = function(x,y) {
    var target = {};
    for(property in x) target[property] = x[property];
    
    for(property in y) {
		if(isObj(y[property])) {
			merge(target[property], y[property]);
		} else {
			if(target && y) target[property] = y[property];
		}
    }
    return target;
}.autoCurry()

//+ unionWith :: (a -> b -> c) -> Object -> Object -> Object
, unionWith = function(f, x, y) {
    f = f.toFunction();
    var target = {};
    for(property in x){ if(x.hasOwnProperty(property)) target[property] = x[property]; }
    
    for(property in y) {
		if(y.hasOwnProperty(property)) {
			if(isObj(y[property].valueOf())) {
				unionWith(f, target[property], y[property]);
			} else {
				if(x[property]) {
					target[property] = f(x[property], y[property]);
				} else {
					target[property] = y[property];
				}
			}
        }
    }
    return target;
}.autoCurry()



// Math
//+ random :: Integer-> Integer
, random = function(i) {
    return Math.floor(Math.random()*i);
}

//+ subtract :: Number -> Number -> Number
, subtract = function(x,y){
    return y - x;
}.autoCurry()

//+ sum :: [Number] -> Number
, sum = functional.reduce('+', 0)

//+ div :: Number -> Number -> Number
, div = function(x,y){ return x / y; }

//+ average :: [Number] -> Number
, average = function(xs) {
    var zerolessArr = filter('!==0', xs);
    return div(sum(zerolessArr), zerolessArr.length);
}



// Other
//+ repeat :: a -> Integer -> [a]
, repeat = function(arg, n) {	
    return nTimes(n, id.curry(arg));
}.autoCurry();



// Add each function in functional.js directly to the namespace
functional.expose(prelude);

// Add functions to the "prelude" namespace,
prelude.equals = equals;
prelude.isArray = isArray;
prelude.isObj = isObj;
prelude.nTimes = nTimes;
prelude.log = log;
prelude.log2 = log2;
prelude.take = take;
prelude.drop = drop;
prelude.unshift = unshift;
prelude.cons = cons;
prelude.concat = concat;
prelude.first = first;
prelude.rest = rest;
prelude.last = last;
prelude.join = join;
prelude.isNumber = isNumber;
prelude.groupsOf = groupsOf;
prelude.zipWith = zipWith;
prelude.uniq = uniq;
prelude.uniqBy = uniqBy;
prelude.reverse = reverse;
prelude.sort = sort;
prelude.element = element;
prelude.flatten = flatten;
prelude.sortBy = sortBy;
prelude.groupBy = groupBy;
prelude.strip = strip;
prelude.split = split;
prelude.test = test;
prelude.match = match;
prelude.replace = replace;
prelude.ifelse = ifelse;
prelude.negate = negate;
prelude.andand = andand;
prelude.oror = oror;
prelude.setVal = setVal;
prelude.getVal = getVal;
prelude.merge = merge;
prelude.unionWith = unionWith;
prelude.random = random;
prelude.subtract = subtract;
prelude.sum = sum;
prelude.div = div;
prelude.average = average;
prelude.repeat = repeat;

// Detect free variable "global" and use it as "window"
if (freeGlobal.global === freeGlobal) {
	window = freeGlobal;
}

// Used to restore the original reference in "noConflict()"
oldPrelude = window.prelude;

// Reverts the "functional" variable to its previous value and 
// returns a reference to the "functional" function.
// example:
//   var functional = functional.noConflict();
prelude.noConflict = function noConflict() {
	window.prelude = oldPrelude;
	return this;
};

// Expose all functions to the global namespace, or specified environment
prelude.expose = function expose(env) {
	var fn;
	env = env || window;
	for (fn in prelude) {
		if (fn !== 'expose' && prelude.hasOwnProperty(fn)) {
			env[fn] = prelude[fn];
		}
	}
};

// Expose FunctionalJS library
// Some AMD build optimizers, like r.js, check for specific condition
// patterns like the following:
if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
	// Expose FunctionalJs to the global object even when an AMD loader
	// is present, in case FunctionalJS was injected by a third-party
	// script and not intended to be loaded as module. The global
	// assignment can be reverted in the FunctionalJS module via its
	// "noConflict()" method.
	window.prelude = prelude;

	// Define an anonymous AMD module, require functional.js lib
	define(['functional'], function (functional) { return prelude; });
}

// Check for "exports" after "define", in case a build optimizer adds
// an "exports" object.
else if (freeExports) {
	// Node.js or RingoJS v0.8.0+
	if (typeof module == 'object' && module && module.exports == freeExports) {
		module.exports = prelude;
	}
	// Narwhal or RingoJS v0.7.0-
	else {
		freeExports.prelude = prelude;
	}
}
