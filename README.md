# fun-js

[![Build Status](https://travis-ci.org/briansorahan/fun-js.png)](https://travis-ci.org/briansorahan/fun-js)

Functional Programming for Javascript

## install

#### node

```
$ npm install fun-js
```

#### browser

Drop fun.js into your project and see usage below.

## test

```
$ ./test
```

See [project page][1] for test suite output.

## usage

**Note: fun-js adds a method called 'autoCurry' to Function.prototype**

#### node.js

```javascript
var assert = require("assert");

// import *everything*
var fun = require("fun").import();

// Currying
var findBrians = filter(function(person) {
    return person.name === "Brian";
});
assert.strictEqual(typeof findBrians, "function", "find can be curried");

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

#### browser

```javascript
// global reference stored under window.fun...
// selectively import 'curry' and 'compose'
fun.import({
    select: [
        "curry",
        "compose"
    ]
});

if (typeof curry !== "function" || typeof compose !== "function") {
    throw new Error("fun-js could not selectively import curry and compose");
}
    
```

## more info
[project page][1]

[1]: http://briansorahan.github.io/fun-js