var fun = require('../fun');
fun.globalize(global);

describe("fun.js", function() {
    var isGlobalizable = "is provided by globalize";
    var isCurriable = "can be curried";
    
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

    var autechre = {
	title: "Best Band Ever",
	genre: "really?",
	location: "Manchester, U.K.",
	albums: [
	    "Incunabula",
	    "Amber",
	    "Tri Repetae",
	    "Chiastic Slide",
	    "LP5",
	    "Confield",
	    "Draft 7:30",
	    "Quaristice",
	    "Oversteps"
	]
    };

    var add = function(x, y) {
	return x + y;
    }.autoCurry();

    var add3 = function(x, y, z) {
	return x + y + z;
    }.autoCurry();

    var subtract = function(x, y) {
	return y - x;
    }.autoCurry();

    describe("id", function() {
	it(isGlobalizable, function() {
	    expect(typeof id).toEqual('function');
	});

	it("passes input through to output", function() {
	    expect(id(5)).toEqual(5);
	});

	it("only works with a single argument", function() {
	    expect(id(5, 6)).toEqual(5);
	});
    });

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
	it(isGlobalizable, function() {
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
	it(isGlobalizable, function() {
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
	it(isGlobalizable, function() {
	    expect(typeof reduce).toEqual('function');
	});
	
	it(isCurriable, function() {
	    var _mostComments = function(current, candidate) {
		return candidate.comments > current.comments ? candidate : current;
	    };

	    var mostComments = reduce(_mostComments, {comments: 0});
	    expect(mostComments(users).name).toEqual("brian");
	});
    });

    describe("map", function() {
	it(isGlobalizable, function() {
	    expect(typeof map).toEqual('function');
	});

	it(isCurriable, function() {
	    var xs = [
		{val: 0, str: "0"},
		{val: 1, str: "1"},
		{val: 2, str: "2"}
	    ];

	    var toNumbers = map(pluck("val"));
	    expect(toNumbers(xs)).toEqual([0, 1, 2]);
	});
    });

    describe("filter", function() {
	it(isGlobalizable, function() {
	    expect(typeof filter).toEqual('function');
	});

	it(isCurriable, function() {
	    var _wellCommented = function(user) {
		return user.comments > 40;
	    };

	    var wellCommented = filter(_wellCommented);
	    expect(wellCommented(users).length).toEqual(2);
	});
    });

    describe("compose", function() {
    	it(isGlobalizable, function() {
	    expect(typeof compose).toEqual('function');
	});

	it(isCurriable, function() {
	    var add2 = compose(subtract(2), add(4));
	    expect(add2(4)).toEqual(6);
	});
    });

    describe("pluck", function() {
	it(isGlobalizable, function() {
	    expect(typeof pluck).toEqual('function');
	});

	it(isCurriable, function() {
	    expect(map(pluck("id"), users)).toEqual([1,2,3,4,5]);
	});
	
	it("returns undefined for nonexistent keys", function() {
	    expect(pluck("foo")(autechre)).not.toBeDefined();
	});
    });

    describe("flip", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof flip).toEqual('function');
    	});

    	it("flips the first two arguments of a function", function() {
	    // var s = function(x, y) { return y - x; };
    	    var mySubtract = flip(subtract);
	    var first = 10, second = 4;
    	    // expect(mySubtract(first, second)).toEqual(subtract(second, first));
    	    expect(mySubtract(first, second)).toEqual(6);
    	});
    });

    describe("and", function() {
	it(isGlobalizable, function() {
	    expect(typeof and).toEqual('function');
	});

	it(isCurriable, function() {
	    expect(and(true)(true)).toBe(true);
	    expect(and(true)(false)).toBe(false);
	    expect(and(false)(true)).toBe(false);
	    expect(and(false)(false)).toBe(false);
	});
    });

    describe("or", function() {
	it(isGlobalizable, function() {
	    expect(typeof or).toEqual('function');
	});

	it(isCurriable, function() {
	    expect(or(false)(false)).toBe(false);
	    expect(or(true)(false)).toBe(true);
	    expect(or(false)(true)).toBe(true);
	    expect(or(true)(true)).toBe(true);
	});
    });

    describe("not", function() {
	it(isGlobalizable, function() {
	    expect(typeof not).toEqual('function');
	});

	it("negates its argument", function() {
	    expect(not(false)).toBe(true);
	    expect(not(true)).toBe(false);
	});
    });

    describe("empty", function() {
	it(isGlobalizable, function() {
	    expect(typeof empty).toEqual('function');
	});

	it("returns true for empty Arrays", function() {
	    expect(empty([])).toBe(true);
	});

	it("returns false for non-empty Arrays", function() {
	    expect(empty([0])).toBe(false);
	});
    });

    describe("head", function() {
	it(isGlobalizable, function() {
	    expect(typeof head).toEqual('function');
	});

	it("returns undefined for empty Arrays", function() {
	    expect(head([])).toBe(undefined);
	});

	it("returns the first element of an Array", function() {
	    expect(head([0])).toEqual(0);
	});
    });

    describe("tail", function() {
	it(isGlobalizable, function() {
	    expect(typeof tail).toEqual('function');
	});

	it("returns an empty Array for empty Arrays", function() {
	    expect(tail([])).toEqual([]);
	});

	it("returns [].slice(1) for non-empty Arrays", function() {
	    expect(tail([0,1,2])).toEqual([1,2]);
	});
    });

    describe("any", function() {
	it(isGlobalizable, function() {
	    expect(typeof any).toEqual('function');
	});

	it(isCurriable, function() {
	    var moreThanSeventyComments = any(compose(gt(70), pluck("comments")));
	    expect(moreThanSeventyComments(users)).toBe(true);
	});
    });

    describe("all", function() {
	it(isGlobalizable, function() {
	    expect(typeof all).toEqual('function');
	});

	it(isCurriable, function() {
	    var ubiquitousID = all(has("id"));
	    expect(ubiquitousID(users)).toBe(true);
	});

	it("returns false for the empty list", function() {
	    expect(all(id, [])).toBe(false);
	});
    });

    describe("find", function() {
	it(isGlobalizable, function() {
	    expect(typeof find).toEqual('function');
	});

	it(isCurriable, function() {
	    var findSam = find(compose(identical("sam"), pluck("name")));
	    expect(findSam(users).comments).toBe(31);
	});
    });

    describe("equal", function() {
	it(isGlobalizable, function() {
	    expect(typeof equal).toEqual('function');
	});

	it(isCurriable, function() {
	    var equalsSeven = equal(7);
	    expect(equalsSeven(7)).toBe(true);
	});

	it("performs type coercion", function() {
	    expect(equal("0", 0)).toBe(true);
	});
    });

    describe("identical", function() {
	it(isGlobalizable, function() {
	    expect(typeof identical).toEqual('function');
	});

	it(isCurriable, function() {
	    var identicalToSeven = identical(7);
	    expect(identicalToSeven(7)).toBe(true);
	});

	it("does not perform type coercion", function() {
	    expect(identical("0", 0)).toBe(false);
	});
    });

    describe("lt", function() {
	it(isGlobalizable, function() {
	    expect(typeof lt).toEqual('function');
	});

	it(isCurriable, function() {
	    var lessThanSeven = lt(7);
	    expect(lessThanSeven(4)).toBe(true);
	    expect(lessThanSeven(8)).toBe(false);
	});
    });

    describe("lte", function() {
	it(isGlobalizable, function() {
	    expect(typeof lte).toEqual('function');
	});

	it(isCurriable, function() {
	    var lessThanOrEqualToSeven = lte(7);
	    expect(lessThanOrEqualToSeven(4)).toBe(true);
	    expect(lessThanOrEqualToSeven(7)).toBe(true);
	    expect(lessThanOrEqualToSeven(8)).toBe(false);
	});
    });

    describe("gt", function() {
	it(isGlobalizable, function() {
	    expect(typeof gt).toEqual('function');
	});

	it(isCurriable, function() {
	    var greaterThanSeven = gt(7);
	    expect(greaterThanSeven(8)).toBe(true);
	    expect(greaterThanSeven(4)).toBe(false);
	});
    });

    describe("gte", function() {
	it(isGlobalizable, function() {
	    expect(typeof gte).toEqual('function');
	});

	it(isCurriable, function() {
	    var greaterThanOrEqualToSeven = gte(7);
	    expect(greaterThanOrEqualToSeven(8)).toBe(true);
	    expect(greaterThanOrEqualToSeven(7)).toBe(true);
	    expect(greaterThanOrEqualToSeven(4)).toBe(false);
	});
    });

    describe("incr", function() {
	it(isGlobalizable, function() {
	    expect(typeof incr).toEqual('function');
	});

	it("returns undefined for non-numeric arguments", function() {
	    expect(incr("foo")).not.toBeDefined();
	});

	it("adds 1 to its argument", function() {
	    expect(incr(1)).toEqual(2);
	});
    });

    describe("decr", function() {
	it(isGlobalizable, function() {
	    expect(typeof decr).toEqual('function');
	});

	it("returns undefined for non-numeric arguments", function() {
	    expect(decr("foo")).not.toBeDefined();
	});

	it("subtracts 1 from its argument", function() {
	    expect(decr(1)).toEqual(0);
	});
    });

    describe("zip", function() {
	var nums1 = [1,1,2,3,5,8,13];
	var nums2 = [0,1,2,3,4];
	var zipSum = [1,2,4,6,9];
	var sumTwo; // add up two lists
	var result;
	
	beforeEach(function() {
	    sumTwo = zip(add);
	    result = sumTwo(nums1, nums2);
	});

	it(isGlobalizable, function() {
	    expect(typeof zip).toEqual('function');
	});

	it(isCurriable, function() {
	    expect(typeof sumTwo).toEqual('function');
	});

	it("returns a list whose length is equal to the shorter of the two input lists", function() {
	    expect(sumTwo(nums1, nums2).length).toEqual(nums2.length);
	});

	it("applies the given function to pairs of elements of the input lists", function() {
	    expect(sumTwo(nums1, nums2)).toEqual(zipSum);
	});
    });
});

