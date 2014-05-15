/*
 * @author Brian Sorahan
 * @license MIT
 * @title fun-js
 * @overview Haskell-esque programming in javascript
 */
var ex = {};
[
    require("./core")
  , require("./either")
  , require("./events")
  , require("./http")
  , require("./iface")
  , require("./list")
  , require("./match")
  , require("./math")
  , require("./maybe")
  , require("./pair")
  , require("./types")

].forEach(function(module) {
    // munge them all together
    Object.keys(module).forEach(function(prop) {
        ex[prop] = module[prop];
    });
});

module.exports = ex;
