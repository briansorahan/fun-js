var fun = require("../src")
  , isFunction = fun.isFunction
;

/**
 * Run 2 assertions that verify that val is a Function,
 * and check val's arity.
 *
 * @param t   - A reference to the test object.
 * @param val - The value under inspection.
 */
module.exports.assertFunction = function(t, arity, val) {
    t.ok(isFunction(val), t.name + " is a Function");
    t.equal(val.length, arity, t.name + " arity equals " + arity);
}

/**
 * Test that a function throws an exception.
 * 
 * @param t - A reference to the test object.
 * @param f - The function that should throw.
 */
module.exports.assertThrows = function(t, f, msg) {
    var threw = false;
    try {
        f(); // maybe pass some args too?
    } catch (err) {
        threw = true;
    } finally {
        t.ok(threw, t.name + " throws when " + msg);
    }
}
