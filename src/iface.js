/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex           = {}
  , core         = require("./core")
  , functions    = core.functions
  , identical    = core.identical
  , isArray      = core.isArray
  , isFunction   = core.isFunction
  , isObject     = core.isObject
  , keys         = core.keys
  , merge        = core.merge
  , not          = core.not
  , objMap       = core.objMap
  , compose      = core.compose
;

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
    if (! isObject(desc)) {
        throw new Error("Iface constructor requires an object");
    }
    // cache an object with just the functions of desc
    this._methods = functions(desc);
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
    return objMap(function(k, v) {
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
        return o === Iface.EmptyDesc ? acc : merge(acc, o);
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
        myFuncNames = keys(self._methods),
        objFuncs = functions(obj),
        objFuncNames = keys(objFuncs);

    if(! isArray(myFuncNames)) {
        return false;
    } else if (! isArray(objFuncNames)) {
        return false;
    } else {
        return myFuncNames.reduce(function(acc, m) {
            return acc &&
                isFunction(objFuncs[m]) &&
                identical(arity(myFuncs[m]), arity(objFuncs[m]));
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
ex.Iface = function(desc) {
    if (! isObject(desc)) {
        throw new Error("Iface constructor expects an object");
    }
    return new Iface(desc);
};

//+ Iface.parse :: String -> Iface
ex.Iface.parse = Iface.parse;
//+ data IFace.Empty
ex.Iface.Empty = Iface.Empty;
//+ isIface :: Object -> Boolean
ex.isIface = core.instanceOf(Iface);

//+ instance :: [Iface] -> Object -> Object
//! Throws an Error if the 2nd param does not implement all
//! interfaces provided in the first param.
//! If all the interfaces from the first param are implemented properly,
//! returns the 2nd param.
var instance = ex.instance = function(ifaces, obj) {
    if (not(isArray(ifaces)) || (ifaces.length === 0))
        throw new Error("instance expects a nonempty Array as first arg");
    if (! (isObject(obj) && obj.hasOwnProperty("where") && isObject(obj.where)))
        throw new Error("instance expects Object with a 'where' Object property as second arg");

    ifaces.forEach(function(iface, i) {
        if (! ex.isIface(iface))
            throw new Error("instance requires an Array of Iface's");

        if (! iface.check(obj.where)) {
            throw new Error("object does not implement interface " + i
                            + " from the first arg to instance");
        }
    });

    return obj.where;
};

//+ isa :: Iface -> Object -> Boolean
ex.isa = function(iface, obj) { return iface.check(obj); }.autoCurry();

//+ isnota :: Iface -> Object -> Boolean
ex.isnota = compose(not, ex.isa);



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
