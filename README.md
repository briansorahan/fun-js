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

**Note: fun-js adds a method called 'autoCurry' to Function.prototype**

```
$ npm install fun-js
```

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

// Composition
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



## more info
[project page][1]

[1]: http://briansorahan.github.io/fun-js
[2]: http://browserify.org
