var fun = require('../fun');
fun.globalize(global);

describe("fun.js", function() {
	var add;
	var add3;

	beforeEach(function() {
		add = function(x, y) {
			return x + y;
		}.autoCurry();

		add3 = function(x, y, z) {
			return x + y + z;
		}.autoCurry();
	});

	describe("autoCurry", function() {
		it("decorates Function", function() {
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
		it("is provided globally", function() {
			expect(typeof isNull).toEqual('function');
		});
		
		it("returns true for null", function() {
			expect(isNull(null)).toBe(true);
		});
		
		it("returns true for undefined", function() {
			expect(isNull(undefined)).toBe(true);
		});
		
		it("returns false for 0", function() {
			expect(isNull(0)).toBe(false);
		});
		
		it("returns false for the empty string", function() {
			expect(isNull("")).toBe(false);
		});
	});

	describe("reduce", function() {
		it("is provided globally", function() {
			expect(typeof reduce).toEqual('function');
		});
		
		it("works with no initial value", function() {
			expect(reduce(add, [1,2,3])).toEqual(6);
		});
		
		it("works with an initial value", function() {
			expect(reduce(add, 1, [1,2,3])).toEqual(7);
		});
	});

	describe("map", function() {
		it("is provided globally", function() {
			expect(typeof map).toEqual('function');
		});
	});

	describe("filter", function() {
		it("is provided globally", function() {
			expect(typeof filter).toEqual('function');
		});
	});

});

