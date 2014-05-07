// merge all the submodules together
var ex = {};
[
    require("./core")
  , require("./http")

].forEach(function(module) {
    Object.getOwnPropertyNames(module).forEach(function(prop) {
        ex[prop] = module[prop];
    });
});

module.exports = ex;
