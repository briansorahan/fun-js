# fun-js

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

**fun-js adds a method called 'autoCurry' to Function.prototype**
**browser usage after v0.0.3 requires [browserify][2]**


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

### types
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
var List = Iface.parse("empty add/1 remove/1")
  , collection = goodStack()
;

assert(!isa(List, collection), "collection does not implement List");
assert(isa(Stack, collection), "collection does implement Stack");
```

## more info
[project page][1]

[1]: http://briansorahan.github.io/fun-js
[2]: http://browserify.org
