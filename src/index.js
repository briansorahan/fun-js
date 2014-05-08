/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex = {};
[
    require("./core")
  , require("./http")

].forEach(function(module) {
    // munge them all together
    Object.getOwnPropertyNames(module).forEach(function(prop) {
        ex[prop] = module[prop];
    });
});

module.exports = ex;
