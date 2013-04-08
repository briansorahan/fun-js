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

//+ id :: a -> a
fun.id = function(x) {
    return x;
};

//+ isNull :: a -> Boolean
fun.isNull = function(obj) {
    return obj === null;
};

fun.isDefined = function(obj) {
    return typeof obj !== 'undefined';
};

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

//+ map :: (a -> b) -> [a] -> [b]
fun.map = function (fn, xs) {
    return xs.map(fn);
}.autoCurry();

//+ filter :: (a -> b) -> [a] -> [b]
fun.filter = function (fn, xs) {
    return xs.filter(fn);
}.autoCurry();

//+ reduce :: (a -> b -> b) -> [b] -> b
//+ reduce :: (a -> b -> b) -> b -> [b] -> b
fun.reduce = function (f, initialValue, xs) {
    return xs.reduce(f, initialValue);
}.autoCurry();

//+ compose :: f -> g -> h 
compose = function () {
    var fns = toArray(arguments), numFns = fns.length;
    return function () {
        var i, returnValue = fns[numFns -1].apply(this, arguments);
        for (i = numFns - 2; i > -1; i--) {
            returnValue = fns[i](returnValue);
        }
        return returnValue;
    };
}.autoCurry();

//+ pluck :: String -> a -> b
pluck = function (name, obj) {
    return obj[name];
}.autoCurry();

//+ sequence :: f -> g -> h
// sequence = function () {
//     var fns = map(Function.toFunction, arguments),
//         arglen = fns.length;
//     return function () {
// 	var i;
// 	for (i = 0; i < arglen; i++) {
// 	    arguments = [fns[i].apply(this, arguments)];
// 	}
// 	return arguments[0];
//     };
// };

//+ memoize :: f -> g
// memoize = function (fn) {  
//     return function () {  
//         var args = Array.prototype.slice.call(arguments),  
//             hash = "",  
//             i = args.length;  
//         currentArg = null;  
//         while (i--) {  
//             currentArg = args[i];  
//             hash += (currentArg === Object(currentArg)) ?  
// 		JSON.stringify(currentArg) : currentArg;  
//             fn.memoize || (fn.memoize = {});  
//         }  
//         return (hash in fn.memoize) ? fn.memoize[hash] :  
// 	    fn.memoize[hash] = fn.apply(this, args);  
//     };  
// };

//+ guard :: (_ -> Bool) -> f -> g -> h
// guard = function (guard, fn, otherwise) {
//     guard = Function.toFunction(guard || I);
//     fn = Function.toFunction(fn);
//     otherwise = Function.toFunction(otherwise || I);
//     return function () {
// 	return (guard.apply(this, arguments) ? fn : otherwise)
// 	    .apply(this, arguments);
//     };
// }.autoCurry();

//+ flip :: f -> g 
flip = function(f) {
    return function () {
	var args = slice.call(arguments, 0);
	args = args.slice(1, 2)
            .concat(args.slice(0, 1))
            .concat(args.slice(2));
	return f.apply(null, args);
    };
};

//+ and :: _ -> (_ -> Bool)
and = function () {
    var args = map(Function.toFunction, arguments),
        arglen = args.length;
    return function () {
	var value = true, i;
	for (i = 0; i < arglen; i++) {
	    if(!(value = args[i].apply(this, arguments)))
		break;
	}
	return value;
    };
};

//+ or :: _ -> (_ -> Bool)
or = function () {
    var args = map(Function.toFunction, arguments),
        arglen = args.length;
    return function () {
	var value = false, i;
	for (i = 0; i < arglen; i++) {
	    if ((value = args[i].apply(this, arguments)))
		break;
	}
	return value;
    };
};

//+ some :: f -> [a] -> Bool
some = function (fn, sequence) {
    fn = Function.toFunction(fn);
    var len = sequence.length,
        value = false,
        i;
    for (i = 0; i < len; i++) {
	if ((value = fn.call(null, sequence[i])))
	    break;
    }
    return value;
}.autoCurry();

//+ every :: f -> [a] -> Bool
every = function (fn, sequence) {
    fn = Function.toFunction(fn);
    var len = sequence.length,
        value = true,
        i;
    for (i = 0; i < len; i++) {
	if (!(value = fn.call(null, sequence[i])))
	    break;
    }
    return value;
}.autoCurry();

//+ not :: f -> (_ -> Bool)
not = function (fn) {
    fn = Function.toFunction(fn);
    return function () {
	return !fn.apply(null, arguments);
    };
};

//+ equal :: _ -> (_ -> Bool)
equal = function () {
    var arglen = arguments.length,
        args = map(Function.toFunction, arguments);
    if (!arglen) {
	return K(true);
    }
    return function () {
	var value = args[0].apply(this, arguments),
	    i;
	for (i = 1; i < arglen; i++){
	    if (value != args[i].apply(this, args))
		return false;
	}
	return true;
    };
};

//+ lamda :: a -> f
lambda = function (object) { 
    return object.toFunction(); 
};

//+ invoke :: String -> (a -> b)
invoke = function (methodName) { 
    var args = slice.call(arguments, 1);
    return function(object) {
	return object[methodName].apply(object, slice.call(arguments, 1).concat(args));
    };
};

//+ until :: a -> f -> (b -> c)
until = function (pred, fn) {
    fn = Function.toFunction(fn);
    pred = Function.toFunction(pred);
    return function (value) {
	while (!pred.call(null, value)) {
	    value = fn.call(null, value);
	}
	return value;
    };
}.autoCurry();

//+ zip :: (List ...) => [a] -> [b] -> ... -> [[a, b, ...]]
zip = function() {
    var n = Math.min.apply(null, map('.length',arguments)),
        results = new Array(n),
        key, i;
    for (i = 0; i < n; i++) {
	key = String(i);
	results[key] = map(pluck(key), arguments);
    };
    return results;
};

//+ I :: a -> a
I = function(x) { return x };

//+ K :: a -> (_ -> a)
K = function(x) { return function () { return x } };

//+ S :: f -> g -> (_ -> b)
S = function(f, g) {
    var toFunction = Function.toFunction;
    f = toFunction(f);
    g = toFunction(g);
    return function () { 
	var return_value_of_g = g.apply(this, arguments)
        , original_args = slice.call(arguments, 0)
        , all_args = [return_value_of_g].concat(original_args);
	return f.apply(this, all_args);
    };
};

// Add public functions to the module namespace,
fun.compose = compose;
fun.flip = flip;
fun.and = and;
fun.and_ = and; // alias reserved word for coffeescript
fun.or = or;
fun.or_ = or; // alias reserved word for coffeescript
fun.some = some;
fun.every = every;
fun.not = not;
fun.not_ = not; // alias reserved word for coffeescript
fun.equal = equal;
fun.lambda = lambda;
fun.invoke = invoke;
fun.pluck = pluck;
fun.until = until;
fun.until_ = until; // alias reserved word for coffeescript
fun.zip = zip;
fun.I = I;
fun.id = I;
fun.K = K;
fun.konst = K;
fun.S = S;

fun.globalize = function(globalObj) {
    [
	"id"
	, "isNull"
	, "isDefined"
	, "reduce"
	, "map"
	, "filter"
	, "compose"
	, "pluck"
    ].map(function(prop) {
	globalObj[prop] = fun[prop];
    });
};

module.exports = fun;