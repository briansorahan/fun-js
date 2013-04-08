var fun = require('../fun');
fun.globalize(global);

describe("fun.js", function() {
    var users = [
	{
	    name: "brian",
	    id: 1,
	    comments: 74
	},
	{
	    name: "sam",
	    id: 2,
	    comments: 31
	},
	{
	    name: "jeremy",
	    id: 3,
	    comments: 38
	},
	{
	    name: "ben",
	    id: 4,
	    comments: 57
	},
	{
	    name: "blake",
	    id: 5,
	    comments: 25
	}
    ];

    var add = function(x, y) {
	return x + y;
    }.autoCurry();

    var add3 = function(x, y, z) {
	return x + y + z;
    }.autoCurry();

    describe("autoCurry", function() {
	it("can be called on any Function object", function() {
	    expect(typeof Function.prototype.autoCurry).toEqual('function');
	});

	it("can be partially applied with one argument", function() {
	    var add1 = add(1);
	    expect(add1(1)).toEqual(2);
	});

	it("can be partially applied with more than one argument", function() {
	    var add4 = add3(2, 2);
	    expect(add4(1)).toEqual(5);
	});
    });

    describe("isNull", function() {
	it("is provided by globalize", function() {
	    expect(typeof isNull).toEqual('function');
	});
	
	it("returns true for null", function() {
	    expect(isNull(null)).toBe(true);
	});
	
	it("returns false for undefined", function() {
	    expect(isNull(undefined)).toBe(false);
	});
	
	it("returns false for 0", function() {
	    expect(isNull(0)).toBe(false);
	});
	
	it("returns false for the empty string", function() {
	    expect(isNull("")).toBe(false);
	});
    });

    describe("isDefined", function() {
	it("is provided by globalize", function() {
	    expect(typeof isDefined).toEqual('function');
	});
	
	it("returns false for undefined", function() {
	    expect(isDefined(undefined)).toBe(false);
	});
	
	it("returns true for null", function() {
	    expect(isDefined(null)).toBe(true);
	});
	
	it("returns true for 0", function() {
	    expect(isDefined(0)).toBe(true);
	});
	
	it("returns true for the empty string", function() {
	    expect(isDefined("")).toBe(true);
	});
    });

    describe("reduce", function() {
	it("is provided by globalize", function() {
	    expect(typeof reduce).toEqual('function');
	});
	
	it("can be curried", function() {
	    var _mostComments = function(current, candidate) {
		return candidate.comments > current.comments ? candidate : current;
	    };

	    var mostComments = reduce(_mostComments, {comments: 0});
	    expect(mostComments(users).name).toEqual("brian");
	});
    });

    describe("map", function() {
	it("is provided by globalize", function() {
	    expect(typeof map).toEqual('function');
	});

	it("can be curried", function() {
	    var xs = [
		{val: 0, str: "0"},
		{val: 1, str: "1"},
		{val: 2, str: "2"}
	    ];

	    var getVal = function(x) {
		return x.val;
	    };

	    var toNumbers = map(getVal);
	    expect(toNumbers(xs)).toEqual([0, 1, 2]);
	});
    });

    describe("filter", function() {
	it("is provided by globalize", function() {
	    expect(typeof filter).toEqual('function');
	});

	it("can be curried", function() {
	    var _wellCommented = function(user) {
		return user.comments > 40;
	    };

	    var wellCommented = filter(_wellCommented);
	    expect(wellCommented(users).length).toEqual(2);
	});
    });

});

