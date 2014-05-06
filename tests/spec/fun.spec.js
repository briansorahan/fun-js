var fun;

if (typeof require === "function") {
    fun = require('../../js/fun');
    fun.import({ under: global });
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
			comments: 81
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

    var Person = Iface({
        greets: function(guest) {},
        stops: function(evil) {}
    });

    describe("Types", function() {
        describe("Functor", function() {
            it("requires fmap/1", function() {
                expect(isObject(Functor.instance({ fmap: function(f) {} }))).toBe(true);

                function bad() {
                    return Functor.instance({ fmap: function(a,b){} });
                }

                expect(bad).toThrow();
            });
        });

        describe("Monad", function() {
            it("requires ret/1 and bind/1", function() {
                var m  = { ret: function(a){}, bind: function(f)  {} };
                var nm = { ret: function(a){}, bind: function(f,g){} };

                expect(isObject(Monad.instance(m))).toBe(true);

                function bad() {
                    return Monad.instance(nm);
                }

                expect(bad).toThrow();
            });
        });

        describe("Pair", function() {
            var p = Pair(1, 2);

            it(isGlobalizable, function() {
                expect(typeof Pair).toEqual("function");
            });

            it(isCurriable, function() {
                expect(typeof Pair(1)).toEqual("function");
            });

            it("exposes its wrapped values through fst and snd", function() {
                expect(fst(p)).toEqual(1);
                expect(snd(p)).toEqual(2);
            });
        });

        describe("Maybe", function() {
            it("is a Functor", function() {
                expect(isa(Functor, Just(1))).toBe(true);
            });

            /*
             * see http://www.haskell.org/haskellwiki/All_About_Monads
             * for the sheep example this is based on
             * each Sheep is possible a clone, so this is why father and
             * mother return Maybe Sheep instead of Sheep
             */
            it("is a Monad", function() {
                // type Sheep
                //     where father :: Sheep -> Maybe Sheep
                //           mother :: Sheep -> Maybe Sheep
                var Sheep = Iface.parse("father mother");
                // Clone type constructor
                Sheep.Clone = function() {
                    return Sheep.instance({
                        father:    function() { return Nothing; },
                        mother:    function() { return Nothing; }
                    });
                };
                // Natural type constructor
                Sheep.Natural = function(mother, father) {
                    return Sheep.instance({
                        father: function() { return Just(father); },
                        mother: function() { return Just(mother); }
                    });
                };
                // father :: Sheep -> Maybe Sheep
                var father = function(s) { return s.father(); };
                // mother :: Sheep -> Maybe Sheep
                var mother = function(s) { return s.mother(); };
                // maternalGrandfather :: Sheep -> Maybe Sheep
                // version 1
                var maternalGrandfather1 = function(s) {
                    var m = mother(s);
                    return m.isNothing() ? Nothing : father(m);
                };
                // mothersPaternalGrandfather :: Sheep -> Maybe Sheep
                // version 1
                var mothersPaternalGrandfather1 = function(s) {
                    var m = mother(s);

                    if (m.isNothing()) {
                        return Nothing;
                    } else {
                        var gf = father(fromMaybe(undefined, m));

                        if (gf.isNothing()) {
                            return Nothing;
                        } else {
                            return father(fromMaybe(undefined, gf));
                        }
                    }
                };
                //
                // a family tree descended from clones where S is the child
                // 
                //                                         S
                //                                         |
                //                 ------------------------------------------------
                //                 |                                              |
                //                M S                                            F S
                //                 |                                              |
                //          ---------------------                     -------------------------
                //          |                   |                     |                       |
                //        M M S               F M S                 M F S                   F F S
                //          |                   |                     |                       |
                //     -----------          ----------            ----------             -----------
                //     |         |          |        |            |        |             |         |
                //  M M M S   F M M S    M F M S  F F M S      M M F S  F M F S       M F F S   F F F S
                //
                var MMMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var FMMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var MFMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var FFMS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var MMFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var FMFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var MFFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());
                var FFFS = Sheep.Natural(Sheep.Clone(), Sheep.Clone());

                var MMS  = Sheep.Natural(MMMS, FMMS);
                var FMS  = Sheep.Natural(MFMS, FFMS);
                var MFS  = Sheep.Natural(MMFS, FMFS);
                var FFS  = Sheep.Natural(MFFS, FFFS);

                var MS   = Sheep.Natural(MMS, FMS);
                var FS   = Sheep.Natural(FMS, FFS);
                
                var S    = Sheep.Natural(MS, FS);

                // expectSheep :: Sheep -> Maybe Sheep -> Boolean
                function expectSheep(sheep, maybe) {
                    if (maybe === Nothing) {
                        expect(false).toBe(true);
                        return Nothing;
                    } else {
                        return maybe.bind(function(s) {
                            expect(s === sheep).toBe(true);
                            return Just(s);
                        });
                    }
                }

                expectSheep(MS,    mother(S));
                expectSheep(FFMS,  mothersPaternalGrandfather1(S));

                // maternalGrandfather :: Sheep -> Maybe Sheep
                // version 2
                var maternalGrandfather2 = function(s) {
                    return Just(s).bind(mother).bind(father);
                };

                // mothersPaternalGrandfather :: Sheep -> Maybe Sheep
                // version 2
                // way better!!
                var mothersPaternalGrandfather2 = function(s) {
                    return Just(s).bind(mother).bind(father).bind(father);
                };

                expectSheep(FMS,   maternalGrandfather2(S));
                expectSheep(FFMS,  mothersPaternalGrandfather2(S));
            });

            it("returns Nothing when trying to fmap over Nothing", function() {
                expect(fmap(function() {}, Nothing)).toEqual(Nothing);
            });
        });

        describe("Either", function() {
            var timesTwo = multiply(2);

            it("provides Left and Right data constructors", function() {
                expect(isFunction(Left)).toBe(true);
                expect(isFunction(Right)).toBe(true);
            });
            
            it("implements fmap", function() {
                var l = Left(1);

                function fail() { expect(1).toEqual(3); }
                function pass(result) { expect(result).toEqual(6); }

                expect(fmap(function() {}, l)).toEqual(l);
                expect(either(fail, pass, fmap(timesTwo, Right(3))));
            });
        });

        describe("Iface", function() {
            var isaPerson = isa(Person);

            var Animal = Iface.parse("breathe/1 eat/1");
            var Star = Iface.parse("burn expand");

            var Fish = {
                breathe: function(stuff) {},
                eat: function(stuff) {}
            };

            var Machine = {
                computes: function(stuff) {}
            };

            var Brian = {
                greets: function(guest) {},
                stops: function(evil) {}
            };

            var Klaatu = {
                vaporizes: function(guest) {},
                stops: function(time) {}
            };
            
            it(isGlobalizable, function() {
                expect(isFunction(Iface)).toBe(true);
            });

            function badIface(type) {
                switch(type) {
                case "number":
                    return function() { Iface(23); };
                case "array":
                    return function() { Iface([]); };
                case "string":
                    return function() { Iface("foo"); };
                case "function":
                    return function() { Iface(function() {}); };
                case "null":
                    return function() { Iface(null); };
                default:
                    return function() { Iface(undefined); };
                }
            }

            it("throws if the constructor is not passed an object", function() {
                expect(badIface("number")).toThrow();
                expect(badIface("array")).toThrow();
                expect(badIface("string")).toThrow();
                expect(badIface("function")).toThrow();
                expect(badIface("null")).toThrow();
                expect(badIface()).toThrow();
            });

            it("enables type-checking through isa", function() {
                expect(isa(Person)(Brian)).toBe(true);
                expect(isa(Person)(Klaatu)).toBe(false);
            });

            it("can parse an Iface from a String", function() {
                expect(isa(Animal)(Fish)).toBe(true);
                expect(isa(Animal)(Machine)).toBe(false);
            });

            it("provides an instance method that throws if an "
               + "Object does not provide a complete implementation", function() {
                var bad = function() {
                    return Animal.instance({
                        breathe: function(stuff) {}
                        // missing 'eats' method
                    });
                };
                expect(bad).toThrow();
            });
        });
    });

    describe("Control", function() {
        describe("CaseMatch", function() {
            it("matches numbers", function() {
                expect(CaseMatch(isNumber, 3)).toBe(true);
                expect(CaseMatch(isNumber, Infinity)).toBe(false);
                expect(CaseMatch(1, 1)).toBe(true);
                expect(CaseMatch(1, 2)).toBe(false);
            });

            it("matches strings", function() {
                expect(CaseMatch("foo", "foo")).toBe(true);
                expect(CaseMatch("foo", "bar")).toBe(false);
                expect(CaseMatch(isString, "foo")).toBe(true);
                expect(CaseMatch(isString, String)).toBe(false);
            });

            it("matches booleans", function() {
                expect(CaseMatch(typeOf("boolean"), true)).toBe(true);
                expect(CaseMatch(typeOf("boolean"), false)).toBe(true);
                expect(CaseMatch(typeOf("boolean"), "boolean")).toBe(false);
                expect(CaseMatch(typeOf("boolean"), null)).toBe(false);
                expect(CaseMatch(typeOf("boolean"), undefined)).toBe(false);
            });

            it("matches objects", function() {
                expect(CaseMatch(typeOf("object"), undefined)).toBe(false);
                expect(CaseMatch(typeOf("object"), null)).toBe(false);
                expect(CaseMatch(typeOf("object"), function() {})).toBe(false);
                expect(CaseMatch(typeOf("object"), [1,2,3])).toBe(false);
                expect(CaseMatch(typeOf("object"), new Array([1,2,3]))).toBe(false);
                expect(CaseMatch(typeOf("object"), { foo: "bar" })).toBe(true);
                expect(CaseMatch(typeOf("object"), Object.create({ foo: "bar" }))).toBe(true);
            });

            it("matches arrays", function() {
                expect(CaseMatch([1,2,3], [1,2,3])).toBe(true);
                expect(CaseMatch(isArray, [1,2,3])).toBe(true);
                expect(CaseMatch(typeOf("string"), [1,2,3])).toBe(false);
                expect(CaseMatch(typeOf("object"), [1,2,3])).toBe(false);
            });

            it("matches functions by feeding them val and testing their return value", function() {
                expect(CaseMatch(isFunction, function() {})).toBe(true);
                expect(CaseMatch(isFunction, { foo : "bar" })).toBe(false);
                expect(CaseMatch(even, 8)).toBe(true);
                expect(CaseMatch(even, 9)).toBe(false);
            });

            it("matches an Iface by checking implementation", function() {
                var incomplete = {
                    greets: function(guest) {}
                };
                var complete = {
                    greets: function(guest) {},
                    stops: function(evil) {}
                };
                expect(CaseMatch(Person, incomplete)).toBe(false);
                expect(CaseMatch(Person, complete)).toBe(true);
            });
        });

        describe("Match", function() {
            var f = Match("foo",                  "foo_matched",
                          typeOf("string"),       "string_matched",
                          [1,2,3],                "123_matched",
                          isArray,                "array_matched",
                          Person,                 "person_matched",
                          Otherwise,              "otherwise");

            it(isGlobalizable, function() {
                expect(isFunction(Match)).toBe(true);
            });

            it("throws if not given an even number of arguments", function() {
                function bad() { Match(1); }
                expect(bad).toThrow();
            });

            describe("tries to DWIM", function() {
                it("detects Array as the first param", function() {
                    expect(f([1,2,3])).toEqual("123_matched");
                    expect(f([1,2,3,4])).toEqual("array_matched");
                });

                it("detects String as the first param", function() {
                    expect(f("foo")).toEqual("foo_matched");
                    expect(f("bar")).toEqual("string_matched");
                });

                it("matches Iface using isa", function() {
                    var p = {
                        greets: function(guest) {},
                        stops:  function(evil)  {}
                    };

                    expect(f(p)).toEqual("person_matched");
                });

                it("calls the pattern with the supplied value if the pattern is a function", function() {
                    var msg = Match(even,      "it's even",
                                    odd,       "it's odd");
                    expect(msg(4)).toEqual("it's even");
                    expect(msg(5)).toEqual("it's odd");
                });
            });

            it("provides an Otherwise method as a catch-all", function() {
                expect(f(null)).toEqual("otherwise");
            });
        }); // Match
    }); // Control

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

    describe("until", function() {
        it(isGlobalizable, function() {
            expect(isFunction(until)).toBe(true);
        });

        it("applies f recursively until p holds", function() {
            var square = function(x) { return x * x; };
            var nextHigherSquare = function(n) { return until(gt(n), square, 2); };
            expect(nextHigherSquare(10)).toEqual(16);
        });

        it("throws if either of its first two arguments is not a function", function() {
            var bad = function() { until("foo", function(){}, 3); };
            var worse = function() { until(function() {}, "bar", 3); };
            expect(bad).toThrow();
            expect(worse).toThrow();
        });
    });

    describe("If", function() {
        it(isGlobalizable, function() {
            expect(isFunction(If)).toBe(true);
        });

        it("returns an Object with a 'Then' method", function() {
            expect(isFunction(If(true).Then)).toBe(true);
        });

        describe("Then", function() {
            it("returns an Object with Elif and Else methods", function() {
                expect(isFunction(If(true).Then(null).Elif)).toBe(true);
                expect(isFunction(If(true).Then(null).Else)).toBe(true);
            });

            it("only returns the value you expect if you chain an Else on the end", function() {
                expect(isFunction(If(true).Then("foo").Else)).toBe(true);
            });

            describe("Elif", function() {
                it("behaves exactly like If", function() {
                    var val = If(false).Then("foo")
                            .Elif(true).Then("bar")
                            .Else("baz");
                    expect(val).toEqual("bar");
                });
            });

            describe("Else", function() {
                it("will call a Function, or just return the given value", function() {
                    var val1 = If(false).Then(function() { return 1; }).Else("foo");
                    var val2 = If(false).Then(2).Else("foo");
                    expect(val1).toEqual(val2);
                });
            });
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

    describe("isFunction", function() {
        it(isGlobalizable, function() {
            // hahahahaha
            expect(isFunction(isFunction)).toBe(true);
        });

        it("returns false for Object, Array, null, undefined, Number, String", function() {
            expect(isFunction({})).toBe(false);
            expect(isFunction([])).toBe(false);
            expect(isFunction(null)).toBe(false);
            expect(isFunction(undefined)).toBe(false);
            expect(isFunction(3)).toBe(false);
            expect(isFunction("foo")).toBe(false);
        });

        it("returns true for Function", function() {
            expect(isFunction(function() {})).toBe(true);
        });
    });

    describe("isObject", function() {
        it(isGlobalizable, function() {
            expect(isFunction(isObject)).toBe(true);
        });

        it("returns false for null, undefined, Number, Array, String, Function", function() {
            expect(isObject(null)).toBe(false);
            expect(isObject(undefined)).toBe(false);
            expect(isObject(3)).toBe(false);
            expect(isObject([])).toBe(false);
            expect(isObject("bar")).toBe(false);
            expect(isObject(function() {})).toBe(false);
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

        it("returns false for strings that could be parsed as numbers", function() {
            expect(isNumber("3")).toBe(false);
            expect(isNumber("3.14")).toBe(false);
        });
		
		it("returns false for objects, arrays, functions", function() {
			expect(isNumber({})).toBe(false);
			expect(isNumber([])).toBe(false);
			expect(isNumber(function() {})).toBe(false);
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

    describe("composer", function() {
        it(isGlobalizable, function() {
            expect(typeof composer).toEqual("function");
        });

        it(isCurriable, function() {
            var isNonEmptyString = composer(pluck("length"), gt(0));
            expect(typeof isNonEmptyString).toEqual("function");
            expect(isNonEmptyString("")).toEqual(false);
            expect(isNonEmptyString("foo")).toBe(true);
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

    describe("fst", function() {
    	it(isGlobalizable, function() {
			expect(typeof fst).toEqual('function');
		});

        it("accepts a single Pair argument, or just returns the first arg", function() {
            expect(fst(1, 2)).toEqual(1);
        });
    });

    describe("snd", function() {
    	it(isGlobalizable, function() {
			expect(typeof snd).toEqual('function');
		});

        it("accepts a single Pair argument, or just returns the second arg", function() {
            expect(snd(1, 2)).toEqual(2);
        });

        it("will return the second of two Pair arguments", function() {
            expect(snd(Pair(1, 2), Pair(3, 4))).toEqual(Pair(3, 4));
        });
    });

    describe("fmap", function() {
        it("throws if the functor does not have an fmap method", function() {
            function bad() { fmap(function() {}, Object); }
            expect(bad).toThrow();
        });

        // FIXME
        xit("calls the functor's fmap method with the supplied function", function() {
            var addTwo = function(n) { return n + 2; };
            expect(fromMaybe(undefined, fmap(addTwo, Just(4)))).toEqual(6);
        });
    });

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

    describe("last", function() {
		it(isGlobalizable, function() {
			expect(typeof last).toEqual('function');
		});

		it("returns undefined for non-Arrays", function() {
			expect(last("foo")).not.toBeDefined();
			expect(last(7)).not.toBeDefined();
			expect(last({})).not.toBeDefined();
		});

		it("returns an empty Array for empty Arrays", function() {
			expect(last([])).toEqual([]);
		});

		it("returns [...].slice(-1)[0] for non-empty Arrays", function() {
			expect(last([0,1,2])).toEqual(2);
		});
    });

    describe("tail", function() {
		it(isGlobalizable, function() {
			expect(typeof tail).toEqual('function');
		});

        it("returns undefined for non-Arrays", function() {
			expect(tail("foo")).not.toBeDefined();
			expect(tail(7)).not.toBeDefined();
			expect(tail({})).not.toBeDefined();
        });

		it("returns an empty Array for empty Arrays", function() {
			expect(tail([])).toEqual([]);
		});

		it("returns [...].slice(1) for non-empty Arrays", function() {
			expect(tail([0,1,2])).toEqual([1,2]);
		});
    });

    describe("init", function() {
		it(isGlobalizable, function() {
			expect(typeof init).toEqual('function');
		});

        it("returns undefined for non-Arrays", function() {
			expect(init("foo")).not.toBeDefined();
			expect(init(7)).not.toBeDefined();
			expect(init({})).not.toBeDefined();
        });

		it("returns an empty Array for empty Arrays", function() {
			expect(init([])).toEqual([]);
		});

		it("returns [...].slice(1) for non-empty Arrays", function() {
			expect(init([0,1,2])).toEqual([0,1]);
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

    describe("iterate", function() {
        var fibonaccis = iterate(function(pair) {
            // (x, y) => (y, x + y)
            return Pair(snd(pair), fst(pair) + snd(pair));
        });

		it(isGlobalizable, function() {
			expect(isFunction(iterate)).toBe(true);
		});

		it(isCurriable, function() {
			expect(isFunction(fibonaccis)).toBe(true);
		});

        it("applies f to x indefinitely", function() {
            var iter = fibonaccis(Pair(1, 1));

            iter = iter.next();
            expect( snd(iter.val()) ).toEqual(2);
            iter = iter.next();
            expect( snd(iter.val()) ).toEqual(3);
            iter = iter.next();
            expect( snd(iter.val()) ).toEqual(5);
            iter = iter.next();
            expect( snd(iter.val()) ).toEqual(8);
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
			expect(findSam(users).comments).toBe(81);
		});
    });

    describe("zip", function() {
		var nums1 = [1,1,2,3,5,8,13];
		var nums2 = [0,1,2,3,4];
		
		it(isGlobalizable, function() {
			expect(typeof zip).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof zip([])).toEqual('function');
		});

		it("returns a list whose length is equal to the shorter of the two input lists", function() {
			expect(zip(nums1, nums2).length).toEqual(nums2.length);
		});

		it("Pair's up elements of the input lists", function() {
            var zipped = zip(nums1, nums2);
            var allPairs = all(fun.isPair, zipped);

            var listsMatch = zipped.reduce(function(acc, p, i) {
                return acc && fst(p) === nums1[i] && snd(p) === nums2[i];
            }, true);

			expect(allPairs).toBe(true);
			expect(listsMatch).toBe(true);
		});
    });

    describe("zipWith", function() {
		var nums1 = [1,1,2,3,5,8,13];
		var nums2 = [0,1,2,3,4];
		var zipSum = [1,2,4,6,9];
		var sumTwo; // add up two lists
		var result;
		
		beforeEach(function() {
			sumTwo = zipWith(add);
			result = sumTwo(nums1, nums2);
		});

		it(isGlobalizable, function() {
			expect(typeof zipWith).toEqual('function');
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

    describe("unzip", function() {
		it(isGlobalizable, function() {
			expect(typeof unzip).toEqual('function');
		});

        it("returns undefined if it is not passed an Array", function() {
            expect(unzip("foo")).not.toBeDefined();
            expect(unzip(4)).not.toBeDefined();
            expect(unzip({})).not.toBeDefined();
        });

        it("returns the empty array if it is passed an empty Array", function() {
            expect(unzip([])).toEqual([]);
        });

        it("converts an Array of Pair's to a Pair of Array's", function() {
            var arr = [
                Pair(1, 2),
                Pair(3, 4),
                Pair("foo", "bar"),
                Pair([1, 2], [3, 4])
            ];

            var unzipped = unzip(arr);
            var areEqual = arr.reduce(function(acc, p, i) {
                return acc
                    && fst(p) === fst(unzipped)[i]
                    && snd(p) === snd(unzipped)[i];
            }, true);

            expect(areEqual).toBe(true);
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

        it("detects if it was only passed the lower bound", function() {
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

    describe("drop", function() {
		var dropFour = drop(4);

		it(isGlobalizable, function() {
			expect(typeof take).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof dropFour).toEqual('function');
		});
		
		it("returns the suffix after the first n elements of the second arg", function() {
            expect(dropFour([1,2,3,4,5,6,7,8])).toEqual([5,6,7,8]);
		});

        it("returns undefined if the first arg is not a number or the second arg is not an Array", function() {
            expect(drop("weird", ["foo", "bar"])).not.toBeDefined();
            expect(drop(3, "foobar")).not.toBeDefined();
        });

        it("uses Math.floor if the first argument is a float", function() {
            expect(drop(3.4, [1,2,3,4,5])).toEqual([4,5]);
        });

        it("behaves exactly like the builtin Array.slice with one arg otherwise", function() {
            var arr = [1,2,3,4,5];
            expect(drop(-2, arr)).toEqual([4,5]);
            expect(drop(0, arr)).toEqual(arr);
            expect(drop(7, arr)).toEqual([]);
        });
    });

    describe("splitAt", function() {
		var splitAtFour = splitAt(4);

		it(isGlobalizable, function() {
			expect(typeof splitAt).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof splitAtFour).toEqual('function');
		});

        it("returns undefined if the first arg is not a number or the second arg is not an Array", function() {
            expect(splitAt("weird", ["foo", "bar"])).not.toBeDefined();
            expect(splitAt(3, "foobar")).not.toBeDefined();
        });

        it("returns Pair(take(n, xs), drop(n, xs))", function() {
            var l = [1, 2, 3, 4, 5, 6, 7, 8];
            var splitPair = splitAtFour(l);
            expect(fun.isPair(splitPair)).toBe(true);
            expect(fst(splitPair)).toEqual([1, 2, 3, 4]);
            expect(snd(splitPair)).toEqual([5, 6, 7, 8]);
        });
    });		

    describe("takeWhile", function() {
        var wellCommented = compose(gte(50), pluck("comments"));
		var takeCommented = takeWhile(wellCommented);

		it(isGlobalizable, function() {
			expect(typeof takeWhile).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof takeWhile).toEqual('function');
		});

        it("returns undefined if the first arg is not a function or the second arg is not an Array", function() {
            expect(takeWhile("weird", ["foo", "bar"])).not.toBeDefined();
            expect(takeWhile(3, "foobar")).not.toBeDefined();
        });

        it("returns the largest prefix of the list for which all elements return true when passed to the first arg", function() {
            expect(takeCommented(users)).toEqual([
                {
                    name: "brian",
                    id: 1,
                    comments: 74
                },
		        {
			        name: "sam",
			        id: 2,
			        comments: 81
		        }
            ]);
        });
    });

    describe("dropWhile", function() {
        var wellCommented = compose(gte(50), pluck("comments"));
		var notCommented = dropWhile(wellCommented);

		it(isGlobalizable, function() {
			expect(typeof dropWhile).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof dropWhile).toEqual('function');
		});

        it("returns undefined if the first arg is not a function or the second arg is not an Array", function() {
            expect(dropWhile("weird", ["foo", "bar"])).not.toBeDefined();
            expect(dropWhile(3, "foobar")).not.toBeDefined();
        });

        it("returns the suffix remaining after takeWhile(n, xs)", function() {
            expect(notCommented(users)).toEqual([
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
            ]);
        });
    });		

    describe("span", function() {
        var wellCommented = compose(gte(50), pluck("comments"));
		var splitUsers = span(wellCommented);
        var spanUsers = splitUsers(users);

		it(isGlobalizable, function() {
			expect(typeof span).toEqual('function');
		});

		it(isCurriable, function() {
			expect(typeof span).toEqual('function');
		});

        it("returns undefined if the first arg is not a function or the second arg is not an Array", function() {
            expect(span("weird", ["foo", "bar"])).not.toBeDefined();
            expect(span(3, "foobar")).not.toBeDefined();
        });

        it("returns Pair(takeWhile(n, xs), dropWhile(n, xs))", function() {
            expect(fst(spanUsers)).toEqual([
                {
                    name: "brian",
                    id: 1,
                    comments: 74
                },
		        {
			        name: "sam",
			        id: 2,
			        comments: 81
		        }
            ]);

            expect(snd(spanUsers)).toEqual([
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
            ]);
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

    xdescribe("isa", function() {
		var isString = isa("string");
        var isFunction = isa("function");
        var isObject = isa("object");

    	it(isGlobalizable, function() {
    	    expect(isFunction(isa)).toBe(true);
    	});

    	it(isCurriable, function() {
    	    expect(isFunction(isString)).toBe(true);
    	});
		
    	it("functions exactly like the builtin typeof operator", function() {
    	    expect(isString(null)).toBe(false);
    	    expect(isString(undefined)).toBe(false);
    	    expect(isString(1)).toBe(false);
            expect(isString([])).toBe(false);
            expect(isString("foo")).toBe(true);
    	    expect(isObject(autechre)).toBe(true);
    	});

        it("returns false when testing if null and Array are Objects", function() {
            expect(isObject(null)).toBe(false);
            expect(isObject([])).toBe(false);
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

    describe("functions", function() {
        it(isGlobalizable, function() {
            expect(isFunction(functions)).toBe(true);
        });

        it("returns undefined if its argument is not an Object, Array, or Function", function() {
            expect(functions("foo")).not.toBeDefined();
            expect(functions(1)).not.toBeDefined();
        });

        it("filters Array with fun.isFunction", function() {
            expect(functions([])).toEqual([]);
            expect(functions(["bar", function() {}]).length).toEqual(1);
        });

        it("returns a new Object with only the key/value pairs whose value is a function", function() {
            var obj = { foo: 4, bar: function() {} };
            expect(isFunction(functions(obj).bar)).toBe(true);
            expect(functions(function() {})).toEqual({});
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

    describe("deepEqual", function() {
		it(isGlobalizable, function() {
			expect(typeof deepEqual).toEqual('function');
		});

		it(isCurriable, function() {
			var deepEqualA = deepEqual({ a:1, b:2 });
			expect(typeof deepEqualA).toBe("function");
		});

        it("performs non-strict deep comparison", function() {
            var obj1 = {
                foo: [ 1, "2", 3, 4 ],
                bar: {
                    b: null,
                    c: "saw",
                    d: {
                        e: "glarb"
                    }
                }
            };

            var obj2 = {
                bar: {
                    d: {
                        e: "glarb"
                    },
                    c: "saw",
                    b: null
                },
                foo: [ 1, 2, 3, 4 ]
            };

            var obj3 = {
                bar: {
                    d: {
                        e: "glarb",
                        f: "glorp"
                    },
                    c: "saw",
                    b: null
                },
                foo: [ 1, 2, 3, 4 ]
            };

            expect(deepEqual(obj1, obj2)).toBe(true);
            expect(deepEqual(obj2, obj3)).toBe(false);
            expect(deepEqual(obj3, obj2)).toBe(false);
        });
    });

    describe("strictDeepEqual", function() {
		it(isGlobalizable, function() {
			expect(typeof strictDeepEqual).toEqual('function');
		});

		it(isCurriable, function() {
			var strictDeepEqualA = strictDeepEqual({ a:1, b:2 });
			expect(typeof strictDeepEqualA).toBe("function");
		});

        it("performs strict deep comparison", function() {
            var obj1 = {
                foo: [ 1, 2, 3, 4 ],
                bar: {
                    b: null,
                    c: "saw",
                    d: {
                        e: "glarb"
                    }
                }
            };

            var obj2 = {
                bar: {
                    d: {
                        e: "glarb"
                    },
                    c: "saw",
                    b: null
                },
                foo: [ 1, 2, 3, 4 ]
            };

            var obj3 = {
                bar: {
                    d: {
                        e: "glarb",
                        f: "glorp"
                    },
                    c: "saw",
                    b: null
                },
                foo: [ 1, 2, 3, 4 ]
            };

            var obj4 = {
                foo: [ "1", 2, 3, 4 ],
                bar: {
                    b: null,
                    c: "saw",
                    d: {
                        e: "glarb"
                    }
                }
            };

            expect(strictDeepEqual(obj1, obj2)).toBe(true);
            expect(strictDeepEqual(obj2, obj3)).toBe(false);
            expect(strictDeepEqual(obj3, obj2)).toBe(false);
            expect(strictDeepEqual(obj1, obj4)).toBe(false);
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

    describe("rem", function() {
    	it(isGlobalizable, function() {
    	    expect(typeof rem).toEqual('function');
    	});

        it("throws if not passed two integers", function() {
            function bad() { rem(4.5, 2); }
            expect(bad).toThrow();
        });

        it("computes the remainder of m/n when you do rem(m, n)", function() {
            expect(rem(5, 2)).toEqual(1);
            expect(rem(2, 5)).toEqual(2);
            expect(rem(7, 7)).toEqual(0);
        });
    });

    describe("even", function() {
    	it(isGlobalizable, function() {
    	    expect(isFunction(even)).toBe(true);
    	});

        it("returns false for floats", function() {
            expect(even(3.14)).toBe(false);
        });

        it("determines if integers are even", function() {
            expect(even(4)).toBe(true);
            expect(even(5)).toBe(false);
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

    describe("import", function() {
        it("does not import itself into the global namespace", function() {
            if (fun.isNodeJS()) {
                expect(typeof global.import).toEqual("undefined");
            } else if (fun.isBrowser()) {
                expect(typeof window.import).toEqual("undefined");
            }
        });

        it("can exclude functions using the 'without' property", function() {
            fun.import({
                without: [
                    "identical"
                ]
            });

            expect(typeof identical).toBe("undefined");
            expect(typeof compose).toBe("function");
        });

        it("can selectively include functions using the 'select' property", function() {
            fun.import({
                select: [
                    "compose"
                ]
            });

            expect(typeof identical).toBe("undefined");
            expect(typeof take).toBe("undefined");
            expect(typeof drop).toBe("undefined");
            expect(typeof compose).toBe("function");
        });

        it("gives without precedence over select", function() {
            fun.import({
                without: [
                    "compose"
                ],
                select: [
                    "compose"
                ]
            });
            expect(typeof compose).toBe("undefined");
        });

        it("supports a user-defined global object", function() {
            var myglobal = {};
            fun.import({
                under: myglobal,
                select: [
                    "compose"
                ]
            });
            expect(typeof myglobal.compose).toEqual("function");
        });
    });

    // if (isNodeJS()) {
    //     describe("node-fun", function() {
    //     });
    // }
});

