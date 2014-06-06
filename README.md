# fun-js

##### Pure functional programming for the working javascript programmer.

The goal of fun-js is to provide a way for people who write lots of javascript
to use techniques borrowed from [haskell][3].

We want to:
 1. Apply the autoCurry function from [wu.js][4] to most of the ECMA-262 standard
 2. Provide a standard way to implement interfaces and check implementations
 3. Use interfaces to define some of the built-in types from the [prelude][5]

## node


[![Build Status](https://travis-ci.org/briansorahan/fun-js.png)](https://travis-ci.org/briansorahan/fun-js)


## browser

[![Browser Compatibility](https://ci.testling.com/briansorahan/fun-js.png)](https://ci.testling.com/briansorahan/fun-js)


## test

```
$ make test
```

## usage

```
$ npm install fun-js
```

```javascript
var fun = require("fun-js");
```

 - **fun-js adds a method called 'autoCurry' to Function.prototype**
 - **browser usage for versions >= 0.0.3 requires [browserify][2]**


### currying
```javascript
var assert     = require("assert")
  , fun        = require("fun-js")
  , compose    = fun.compose
  , filter     = fun.filter
  , not        = fun.not
  , empty      = fun.empty
  , identical  = fun.identical
  , pluck      = fun.pluck
  , isDefined  = fun.isDefined
  , find       = fun.find
;

// Currying
var findBrians = filter(function(person) {
    return person.name === "Brian";
});
assert.strictEqual(typeof findBrians, "function", "filter can be curried");
```

### composition
```javascript
var hasBrian = compose(compose(not, empty), findBrians);
assert.strictEqual(typeof hasBrian, "function", "compose creates new functions from old ones");

var beatles = [
    { name : "John" },
    { name : "Paul" },
    { name : "George" },
    { name : "Ringo" },
    { name : "Brian" }
];

assert(hasBrian(beatles), "Brian is a legendary rock star");

// Another way of making a hasBrian function...
var isBrian = compose(identical("Brian"), pluck("name"));
var hasBrian2 = compose(isDefined, find(isBrian));
assert(hasBrian2(beatles), "double-checking that Brian is a legendary rock star");
```

### interfaces
One of the biggest problems with using haskell techniques in
javascript is the difference between the type systems of the
two languages. Part of the beauty of javascript, the reason
why we can write code quickly with it, is because of its dynamic
typing. This is also why writing haskell-ish code in
javascript seems awkward because there is no compiler to
ensure that a function that *should* return a particular type
actually does.

The way fun-js solves this is with interfaces.

Interfaces allow you to easily check if an object contains
a set of function properties. It is also really easy to
create an interface from a string using Iface.parse.
Each function will be listed in the string followed by
its arity. You can also call Iface.parse with any number of
string arguments, which makes it easier to create large
interfaces without having a run-on line.
```javascript
var Iface = fun.Iface
  , instance = fun.instance
  , isa = fun.isa
;

var Stack = Iface.parse("empty push/1 pop");

// Iface.prototype.instance duck-types an object to
// determine if it correctly implements a given interface
// (checks name and arity)
// if it implements the interface the object itself is
// returned, otherwise an Exception is thrown
var badStack = function() {
    // this implementation omits the 'empty' function
    var stack = [];
    return Stack.instance({
        push: function(value) {
            return stack.push(value);
        },
        pop: function() {
            return stack.pop();
        }
    });
};

var goodStack = function() {
    var stack = [];
    return Stack.instance({
        empty: function() {
            return empty(stack);
        },
        push: function(value) {
            return stack.push(value);
        },
        pop: function() {
            return stack.pop();
        }
    });
};

assert.throws(badStack);

// isa returns true/false if an object
// does/doesn't implement an interface
var List = Iface.parse("empty"
                     , "clear"
                     , "contains/1"
                     , "indexOf/1"
                     , "size"
                     , "add/1"
                     , "remove/1")
  , collection = goodStack()
;

assert(!isa(List, collection), "collection does not implement List");
assert(isa(Stack, collection), "collection does implement Stack");

// a third way to define an Iface, provides more detail
// about the args that each function expects
var Person = Iface({
    greets: function(guest) {},
    stops: function(evil) {}
});
```

### types
```javascript
// builtin types include Eq, Functor, Monad
// these are all Iface's -- see src/types.js
assert(isa(Eq, {
    eq: function(other) {}
});

assert(isa(Functor, {
    fmap: function(f) {}
});

assert(isa(Monad, {
    unit: function(val) {}
  , bind: function(f) {}
});
```

## more info
[project page][1]

[1]: http://briansorahan.github.io/fun-js
[2]: http://browserify.org
[3]: http://haskell.org
[4]: http://fitzgen.github.io/wu.js/
[5]: http://hackage.haskell.org/package/base-4.7.0.0/docs/Prelude.html
