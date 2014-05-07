var ex      = {};

// Pair
var Pair = function(x, y) { this.x = x; this.y = y; };

Pair.prototype.first = function() {
    return this.x;
};

Pair.prototype.second = function() {
    return this.y;
};

// Pair data constructor
ex.Pair = function(x, y) {
    return new Pair(x, y);
}.autoCurry();

//+ isPair :: _ -> Boolean
ex.isPair = function(x) {
    return x instanceof Pair;
};

//+ fst :: Pair a b -> a
ex.fst = function(a, b) {
    if (ex.isPair(a) && (typeof b === "undefined")) {
        return a.first();
    } else {
        return a;
    }
};

//+ snd :: (a -> b -> c) -> a
ex.snd = function(a, b) {
    if (ex.isPair(a) && (typeof b === "undefined")) {
        return a.second();
    } else {
        return b;
    }
};



Object.getOwnPropertyNames(ex).forEach(function(prop) {
    module.exports[prop] = ex[prop];
});
