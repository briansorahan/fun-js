require('../fun');

describe("fun.js", function() {
	describe("autoCurry", function() {
		it("decorates Function", function() {
			expect(typeof Function.prototype.autoCurry).toEqual('function');
		});

		it("properly curries functions", function() {
			var add = function(x, y) {
				return x + y;
			}.autoCurry();

			var add1 = add(1);
			expect(add1(1)).toEqual(2);
		});
	});
});
