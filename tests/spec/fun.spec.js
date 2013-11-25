if (typeof require === "function") {
    require('../../js/fun').import({ under: global });
} else if (typeof fun === "object") {
    fun.import({ under: window });
}

describe("fun.js", function() {
    var isGlobalizable = "can be imported into the global namespace";
    var isCurriable = "can be curried";
    
	var texasCities = [
        "Abilene",
        "Amarillo",
        "Austin",
        "Beaumont",
        "Dallas",
        "Galveston",
        "Houston",
        "Longview",
        "Lubbock",
        "Midland",
        "Nacogdoches",
        "Odessa",
        "San Antonio",
        "Waco"
    ];

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

	////////////////////////////////////////
	// type-checking
	////////////////////////////////////////

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

    describe("isNumber", function() {
		it(isGlobalizable, function() {
			expect(typeof isNumber).toEqual('function');
		});
		
		it("returns false for undefined and null", function() {
			expect(isNumber(undefined)).toBe(false);
			expect(isNumber(null)).toBe(false);
		});
		
		it("returns true for integers and floats", function() {
			expect(isNumber(0)).toBe(true);
			expect(isNumber(0.1)).toBe(true);
		});
		
		it("returns false for the objects, arrays, functions", function() {
			expect(isNumber({})).toBe(false);
			expect(isNumber([])).toBe(false);
			expect(isNumber(function() {})).toBe(false);
		});
    });

    describe("isArray", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof isArray).toEqual('function');
    	});
		
    	it("returns false for undefined", function() {
    	    expect(isArray(undefined)).toBe(false);
    	});
		
    	it("returns false for null", function() {
    	    expect(isArray(null)).toBe(false);
    	});
		
    	it("returns false for numbers, objects, functions", function() {
    	    expect(isArray(0)).toBe(false);
    	    expect(isArray({})).toBe(false);
    	    expect(isArray(function() {})).toBe(false);
    	});
		
    	it("returns true for the arrays", function() {
    	    expect(isArray([])).toBe(true);
    	});
    });

    describe("isObject", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof isObject).toEqual('function');
    	});
		
    	it("returns false for undefined", function() {
    	    expect(isObject(undefined)).toBe(false);
    	});

    	it("returns false for number, array, function", function() {
    	    expect(isObject(3)).toBe(false);
    	    expect(isObject([])).toBe(false);
    	    expect(isObject(function() {})).toBe(false);
    	});
		
    	it("returns true for null", function() {
    	    expect(isObject(null)).toBe(true);
    	});

    	it("returns true for object", function() {
    	    expect(isObject({})).toBe(true);
    	});
    });

	////////////////////////////////////////
	// Function
	////////////////////////////////////////

    describe("curry", function() {
        it("can be called on any Function object", function() {
            expect(typeof Function.prototype.autoCurry).toEqual('function');
        });

        it("can be partially applied with one argument", function() {
            var add1 = curry(add, 1);
            expect(add1(1)).toEqual(2);
        });

        it("can be partially applied with more than one argument", function() {
            var add4 = curry(add3, 2, 2);
            expect(add4(1)).toEqual(5);
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

    describe("compose", function() {
    	it(isGlobalizable, function() {
			expect(typeof compose).toEqual('function');
		});

		it(isCurriable, function() {
			var add2 = compose(subtract(2), add(4));
			expect(add2(4)).toEqual(6);
		});
    });

    describe("flip", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof flip).toEqual('function');
    	});

    	it("flips the first two arguments of a function", function() {
    	    var mySubtract = flip(subtract);
			var first = 10, second = 4;
    	    expect(mySubtract(first, second)).toEqual(6);
    	});
    });

	////////////////////////////////////////
	// Array
	////////////////////////////////////////

    describe("reduce", function() {
		var _mostComments = function(current, candidate) {
			return candidate.comments > current.comments ? candidate : current;
		};

		var mostComments = reduce(_mostComments, {comments: 0});

		it(isGlobalizable, function() {
			expect(typeof reduce).toEqual('function');
		});
		
		it(isCurriable, function() {
			expect(typeof mostComments).toEqual("function");
		});

		it("functions exactly like the builtin Array.reduce", function() {
			var result = users.reduce(_mostComments);
			expect(mostComments(users)).toEqual(result);
		});
    });

    describe("reduceRight", function() {
		var _totalComments = function(acc, user) {
			return acc + user.comments;
		};

		var totalComments = reduceRight(_totalComments, 0);

		it(isGlobalizable, function() {
			expect(typeof reduceRight).toEqual('function');
		});
		
		it(isCurriable, function() {
			expect(typeof totalComments).toEqual("function");
		});

		it("functions exactly like the builtin Array.reduceRight", function() {
			var result = users.reduceRight(_totalComments, 0);
			expect(totalComments(users)).toEqual(result);
		});
    });

    describe("map", function() {
		var xs = [
			{val: 0, str: "0"},
			{val: 1, str: "1"},
			{val: 2, str: "2"}
		];

		var _mapf = pluck("val");
		var toNumbers = map(_mapf);

		it(isGlobalizable, function() {
			expect(typeof map).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof toNumbers).toEqual('function');
		});

		it("functions exactly like the builtin Array.map", function() {
			var result = xs.map(_mapf);
			expect(toNumbers(xs)).toEqual(result);
		});
    });

    describe("filter", function() {
		var _wellCommented = function(user) {
			return user.comments > 40;
		};

		var wellCommented = filter(_wellCommented);

		it(isGlobalizable, function() {
			expect(typeof filter).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof wellCommented).toEqual('function');
		});

		it("functions exactly like the builtin Array.filter", function() {
			var result = users.filter(_wellCommented);
			expect(wellCommented(users)).toEqual(result);
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
		var moreThanSeventyComments = any(compose(gt(70), pluck("comments")));

		it(isGlobalizable, function() {
			expect(typeof any).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof moreThanSeventyComments).toEqual('function');
		});

		it("functions exactly like the builtin Array.some", function() {
			expect(moreThanSeventyComments(users)).toBe(true);
		});
    });

    describe("all", function() {
		var ubiquitousID = all(has("id"));

		it(isGlobalizable, function() {
			expect(typeof all).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof ubiquitousID).toEqual('function');
		});

		it("returns true for the empty list", function() {
			expect(all(id, [])).toBe(true);
		});

		it("functions exactly like the builtin Array.every", function() {
			expect(ubiquitousID(users)).toBe(true);
		});
    });

    describe("find", function() {
		var findSam = find(compose(identical("sam"), pluck("name")));

		it(isGlobalizable, function() {
			expect(typeof find).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof findSam).toBe('function');
		});

		it("finds the first array element that satisfies the predicate", function() {
			expect(findSam(users).comments).toBe(31);
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

    describe("join", function() {
		var cities = ["Austin", "Dallas", "Houston"];
		var result = "Austin:Dallas:Houston";
		var joinColons = join(":");

		it(isGlobalizable, function() {
			expect(typeof join).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof joinColons).toEqual('function');
		});
		
		it("functions exactly like the builtin Array.join", function() {
			expect(joinColons(cities)).toEqual(result);
		});
    });

    describe("slice", function() {
		var cities = ["Austin", "Dallas", "Houston", "Lubbock", "Waco"];
		var lower = 1, upper = cities.length - 1;
		var sliceMiddle = slice(lower, upper);

		it(isGlobalizable, function() {
			expect(typeof slice).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof sliceMiddle).toEqual('function');
		});
		
		it("functions exactly like the builtin Array.slice", function() {
			expect(sliceMiddle(cities)).toEqual(cities.slice(lower, upper));
		});
    });

    describe("indexOf", function() {
		var cities = ["Austin", "Dallas", "Houston", "Lubbock", "Waco", "Houston"];
		var indexOfHouston = indexOf("Houston");

		it(isGlobalizable, function() {
			expect(typeof indexOf).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof indexOfHouston).toEqual('function');
		});
		
		it("functions exactly like the builtin Array.indexOf", function() {
			expect(indexOfHouston(cities)).toEqual(cities.indexOf("Houston"));
		});
    });

    describe("lastIndexOf", function() {
		var cities = ["Austin", "Dallas", "Houston", "Lubbock", "Waco", "Houston"];
		var lastIndexOfHouston = lastIndexOf("Houston");

		it(isGlobalizable, function() {
			expect(typeof lastIndexOf).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof lastIndexOfHouston).toEqual('function');
		});
		
		it("functions exactly like the builtin Array.lastIndexOf", function() {
			expect(lastIndexOfHouston(cities)).toEqual(cities.lastIndexOf("Houston"));
		});
    });

    describe("contains", function() {
		var containsAustin = contains("Austin");

		it(isGlobalizable, function() {
			expect(typeof contains).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof containsAustin).toEqual('function');
		});
		
		it("Determines whether an array contains a value", function() {
			expect(containsAustin(texasCities)).toBe(true);
            expect(containsAustin([])).toBe(false);
		});

		it("Returns false for the empty list", function() {
            expect(containsAustin([])).toBe(false);
		});

        it("Does not perform type coercion", function() {
            expect(contains(1, ["1", "2", "3"])).toBe(false);
            expect(contains(1, [1,2,3])).toBe(true);
        });
    });

    describe("elem", function() {
		var inTx = elem(texasCities);

		it(isGlobalizable, function() {
			expect(typeof elem).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof inTx).toEqual('function');
		});
		
		it("is `contains` with the arguments reversed", function() {
			expect(inTx("Lubbock")).toBe(true);
			expect(inTx("Durham")).toBe(false);
            expect(elem([1,2,3], 1)).toBe(true);
            expect(elem(["1", "2", "3"], 1)).toBe(false);
		});
    });

    describe("diff(a, b)", function() {
        var a = ["a", "b", "c"];
        var diffA = diff(a);

    	it(isGlobalizable, function() {
    	    expect(typeof diff).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof diffA).toEqual('function');
    	});

		it("returns an object with `added` and `removed` properties", function() {
            expect(diffA([]).added).toBeDefined();
            expect(diffA([]).removed).toBeDefined();
		});

        it("tells you which values are in b but not in a (`added`)", function() {
            expect(diffA(["d"]).added).toEqual(["d"]);
        });

        it("tells you which values are in a but not in b (`removed`)", function() {
            expect(diffA(["d"]).removed).toEqual(["a", "b", "c"]);
        });

        it("returns undefined if either of the first two args are not Arrays", function() {
            expect(diff(1, ["d"])).not.toBeDefined();
        });
    });

    describe("replicate", function() {
		var fourTimes = replicate(4);

		it(isGlobalizable, function() {
			expect(typeof replicate).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof fourTimes).toEqual('function');
		});
		
		it("creates an Array of length n with each value equal to the second arg", function() {
            expect(fourTimes("r")).toEqual(["r", "r", "r", "r"]);
		});

        it("returns undefined if the first arg is not a number", function() {
            expect(replicate("weird", "something")).not.toBeDefined();
        });

        it("uses Math.floor if the first argument is a float", function() {
            expect(replicate(3.4, "a")).toEqual(["a", "a", "a"]);
        });

        it("returns the empty list if the first arg is 0", function() {
            expect(replicate(0, null)).toEqual([]);
        });
    });

    describe("take", function() {
		var takeFour = take(4);

		it(isGlobalizable, function() {
			expect(typeof take).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof takeFour).toEqual('function');
		});
		
		it("returns an Array of the first n elements of the second arg", function() {
            expect(takeFour([1,2,3,4,5,6,7,8])).toEqual([1,2,3,4]);
		});

        it("returns undefined if the first arg is not a number or the second arg is not an Array", function() {
            expect(take("weird", ["foo", "bar"])).not.toBeDefined();
            expect(take(3, "foobar")).not.toBeDefined();
        });

        it("uses Math.floor if the first argument is a float", function() {
            expect(take(3.4, [1,2,3,4,5])).toEqual([1,2,3]);
        });

        it("returns the empty list if the first arg is 0 or the second arg is the empty list", function() {
            expect(take(0, [1,2,3])).toEqual([]);
            expect(take(5, [])).toEqual([]);
        });

        it("returns the second arg if n >= length of the array", function() {
            expect(take(4, [1,2,3])).toEqual([1,2,3]);
        });
    });

	////////////////////////////////////////
	// Object
	////////////////////////////////////////

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

    describe("has", function() {
		it(isGlobalizable, function() {
			expect(typeof has).toEqual('function');
		});

		it("functions exactly like the builtin Object.hasOwnProperty", function() {
			expect(has("foo")(autechre)).toBe(false);
			expect(has("albums")(autechre)).toBe(true);
		});
    });

    describe("instanceOf", function() {
		var _isArray = instanceOf(Array);

    	it(isGlobalizable, function() {
    	    expect(typeof instanceOf).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof _isArray).toEqual('function');
    	});
		
    	it("functions exactly like the builtin instanceof operator", function() {
    	    expect(_isArray(autechre)).toBe(false);
    	    expect(instanceOf(Object)(autechre)).toBe(true);
    	});
    });

	describe("objMap", function() {
		var incrVals = objMap(function(k,v) { return v + 1; });

		it(isGlobalizable, function() {
			expect(typeof objMap).toEqual('function');
		});

    	it(isCurriable, function() {
    	    expect(typeof incrVals).toEqual('function');
    	});
		
		it("maps over key/value pairs of an object", function() {
			var input = {a: 1, b: 2, c: 3};
			expect(incrVals(input)).toEqual([2,3,4]);
		});
	});

    describe("keys", function() {
		var input = {a: 1, b: 2, c: 3};

		it(isGlobalizable, function() {
			expect(typeof keys).toEqual('function');
		});

        it("returns the keys (using hasOwnProperty) of an Object", function() {
            expect(keys(input)).toEqual(["a", "b", "c"]);
        });
    });

    describe("vals", function() {
		var input = {a: 1, b: 2, c: 3};
        var keyMsg = "(using hasOwnProperty to get the keys)";

		it(isGlobalizable, function() {
			expect(typeof vals).toEqual('function');
		});

        it("returns the values " + keyMsg + " of an Object", function() {
            expect(vals(input)).toEqual([1, 2, 3]);
        });
    });

    describe("merge", function() {
        var a = { foo: 1, bar: 2, snork: ["hi"] },
            b = { eep: 4, op: 5, ork: 6, foo: { prop: "string" }};

        it(isGlobalizable, function() {
            expect(typeof merge).toEqual("function");
        });

        it("does a shallow merge of two objects, with values from the second taking precedence", function() {
            expect(merge(a, b)).toEqual({ foo: { prop: "string" }, bar: 2, snork: ["hi"], eep: 4, op: 5, ork: 6 });
        });
    });

    describe("reduceOwn", function() {
        var oneLetterProps = reduceOwn(function(result, k, v) {
            if (k.length === 1) {
                result[k] = v;
            }
        });

        it(isGlobalizable, function() {
            expect(typeof reduceOwn).toEqual("function");
        });

        it(isCurriable, function() {
            expect(typeof oneLetterProps).toEqual("function");
        });

        it("reduces an Object to a result Object using a callback that accepts the result object and key/value pairs", function() {
            expect(oneLetterProps({ a: 1, ab: 3, abc: 5 })).toEqual({ a: 1 });
        });
    });

	////////////////////////////////////////
	// Logic
	////////////////////////////////////////

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

	////////////////////////////////////////
	// Comparison
	////////////////////////////////////////

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

	////////////////////////////////////////
	// Number
	////////////////////////////////////////

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

    describe("min", function() {
		it(isGlobalizable, function() {
			expect(typeof min).toEqual('function');
		});

		it("functions exactly like the builtin Math.min", function() {
			expect(min([4, 0, 8])).toEqual(Math.min(4, 0, 8));
		});

        it("returns undefined if you call it with anything other than an array", function() {
            expect(min("foo")).not.toBeDefined();
        });
    });

    describe("max", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof max).toEqual('function');
    	});

    	it("functions exactly like the builtin Math.max", function() {
    	    expect(max([1, 4, 9])).toEqual(Math.max(1, 4, 9));
    	});

        it("returns undefined if you call it with anything other than an array", function() {
            expect(min("foo")).not.toBeDefined();
        });
    });

    describe("pow", function() {
    	var pow2 = pow(2);

    	it(isGlobalizable, function() {
    	    expect(typeof pow).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof pow2).toEqual('function');
    	});

    	it("functions exactly like the builtin Math.pow", function() {
    	    expect(pow2(4)).toEqual(Math.pow(4, 2));
    	});
    });

    describe("sum", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof sum).toEqual('function');
    	});

        it("sums an Array of numbers", function() {
            expect(sum([1,2,3])).toEqual(6);
        });
    });

    describe("product", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof product).toEqual('function');
    	});

        it("sums an Array of numbers", function() {
            expect(product([1,2,3])).toEqual(6);
        });
    });

	////////////////////////////////////////
	// String
	////////////////////////////////////////

    describe("strcat", function() {
		var base = "cat";
		var catcat = strcat(base);

    	it(isGlobalizable, function() {
    	    expect(typeof strcat).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof catcat).toEqual('function');
    	});

		it("functions exactly like String.concat with 1 arg", function() {
			var pre = "Thunder";
			var emptyString = "";
			expect(catcat(emptyString)).toEqual(base);
			expect(catcat(pre)).toEqual(pre.concat(base)); // Thundercat
		});
    });

    // not yet implemented in node v0.10.0 [bps]
    // describe("contains", function() {
    // 	var substring = "cat";
    // 	var hascat = contains(substring);

    // 	it(isGlobalizable, function() {
    // 	    expect(typeof contains).toEqual('function');
    // 	});

    // 	it(isCurriable, function() {
    // 	    expect(typeof hascat).toEqual('function');
    // 	});

    // 	it("functions exactly like String.contains", function() {
    // 	    var does = "catamorphism";
    // 	    var doesnt = "anamorphism";

    // 	    expect(hascat(does)).toEqual(does.contains(substring));
    // 	    expect(hascat(doesnt)).toEqual(doesnt.contains(substring));
    // 	});
    // });

    // describe("endsWith", function() {
    // 	var ending = "cat";
    // 	var endsWithCat = endsWith(ending);

    // 	it(isGlobalizable, function() {
    // 	    expect(typeof endsWith).toEqual('function');
    // 	});

    // 	it(isCurriable, function() {
    // 	    expect(typeof endsWithCat).toEqual('function');
    // 	});

    // 	it("functions exactly like String.endsWith", function() {
    // 	    var does = "Thundercat";
    // 	    var doesnt = "Lion-O";

    // 	    expect(endsWithCat(does)).toEqual(does.endsWith(ending));
    // 	    expect(endsWithCat(doesnt)).toEqual(doesnt.endsWith(ending));
    // 	});
    // });

    describe("indexOf (for String)", function() {
		var searchString = "blabber";
		var indexOfb = indexOf("b");

    	it(isGlobalizable, function() {
    	    expect(typeof indexOf).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof indexOfb).toEqual('function');
    	});

		it("functions exactly like String.indexOf", function() {
			expect(indexOfb(searchString)).toEqual(searchString.indexOf("b"));
		});
    });

    describe("lastIndexOf (for String)", function() {
		var searchString = "blabber";
		var lastIndexOfb = lastIndexOf("b");

    	it(isGlobalizable, function() {
    	    expect(typeof lastIndexOf).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof lastIndexOfb).toEqual('function');
    	});

		it("functions exactly like String.lastIndexOf", function() {
			expect(lastIndexOfb(searchString)).toEqual(searchString.lastIndexOf("b"));
		});
    });

    describe("match", function() {
		var searchString = "blabbermouth";
		var regex = /[aeiou]b{2}/;
		var matchesRegex = match(regex);

    	it(isGlobalizable, function() {
    	    expect(typeof match).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof matchesRegex).toEqual('function');
    	});

		it("functions exactly like String.match", function() {
			expect(matchesRegex(searchString)).toEqual(searchString.match(regex));
		});
    });

    describe("replace", function() {
		var searchString = "blabbermouth";
		var pat = /[aeiou]b{2}/;
		var replacement = "ubb";
		var replaceIt = replace(pat, replacement);

    	it(isGlobalizable, function() {
    	    expect(typeof replace).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof replaceIt).toEqual('function');
    	});

		it("functions exactly like String.replace", function() {
			expect(replaceIt(searchString)).toEqual(searchString.replace(pat, replacement));
		});
    });

    describe("search", function() {
		var string = "blabbermouth";
		var pattern = /[aeiou]b{2}/;
		var searchPattern = search(pattern);

    	it(isGlobalizable, function() {
    	    expect(typeof search).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof searchPattern).toEqual('function');
    	});

		it("functions exactly like the builtin String.search", function() {
			expect(searchPattern(string)).toEqual(string.search(pattern));
		});
    });

    describe("slice (for String)", function() {
		var string = "blabbermouth";
		var lower = 2, upper = 5, substring = "abb";
		var sliceMiddle = slice(lower, upper);

    	it(isGlobalizable, function() {
    	    expect(typeof slice).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof sliceMiddle).toEqual('function');
    	});

		it("functions exactly like the builtin String.slice", function() {
			expect(sliceMiddle(string)).toEqual(string.slice(lower, upper));
		});
    });

    describe("reverse", function() {
		var arr = [1, 2, 3];
        var reversed = reverse(arr);

    	it(isGlobalizable, function() {
    	    expect(typeof slice).toEqual('function');
    	});
        
        it("is non-destructive", function() {
            expect(arr).toEqual([1,2,3]);
        });

		it("functions like the builtin Array.reverse", function() {
			expect(reversed).toEqual(arr.reverse());
		});
    });

    describe("split", function() {
		var string = "blabbermouth";
		var splitBs = split("b");
		var result = ['', 'la', '', 'ermouth'];

    	it(isGlobalizable, function() {
    	    expect(typeof split).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof splitBs).toEqual('function');
    	});

		it("functions exactly like the builtin String.split", function() {
			expect(splitBs(string)).toEqual(string.split("b"));
		});
    });

    describe("substr", function() {
		var string = "blabbermouth";
		var start = 2, len = 3, result = "abb";
		var getMiddle = substr(start, len);

    	it(isGlobalizable, function() {
    	    expect(typeof substr).toEqual('function');
    	});

    	it(isCurriable, function() {
    	    expect(typeof getMiddle).toEqual('function');
    	});

		it("functions exactly like the builtin String.substr", function() {
			expect(getMiddle(string)).toEqual(string.substr(start, len));
		});
    });

    describe("toLower", function() {
		var string = "HELLOworld";

    	it(isGlobalizable, function() {
    	    expect(typeof toLower).toEqual('function');
    	});

		it("functions exactly like the builtin String.toLowerCase", function() {
			expect(toLower(string)).toEqual(string.toLowerCase());
		});
    });

    describe("toUpper", function() {
		var string = "HELLOworld";

    	it(isGlobalizable, function() {
    	    expect(typeof toUpper).toEqual('function');
    	});

		it("functions exactly like the builtin String.toUpperCase", function() {
			expect(toUpper(string)).toEqual(string.toUpperCase());
		});
    });

    describe("trim", function() {
		var string = "  HELLOworld  \t\n";

    	it(isGlobalizable, function() {
    	    expect(typeof trim).toEqual('function');
    	});

		it("functions exactly like the builtin String.trim", function() {
			expect(trim(string)).toEqual(string.trim());
		});
    });

    describe("trimRight", function() {
		var string = "  HELLOworld  \t\n";

    	it(isGlobalizable, function() {
    	    expect(typeof trimRight).toEqual('function');
    	});

		it("functions exactly like the builtin String.trimRight", function() {
			expect(trimRight(string)).toEqual(string.trimRight());
		});
    });

    describe("trimLeft", function() {
		var string = "  HELLOworld  \t\n";

    	it(isGlobalizable, function() {
    	    expect(typeof trimLeft).toEqual('function');
    	});

		it("functions exactly like the builtin String.trimLeft", function() {
			expect(trimLeft(string)).toEqual(string.trimLeft());
		});
    });
});

