Tests.prototype.NetworkTests = function() {
	module('Network (navigator.network)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.network != null, "navigator.network is null!");
	});
	test("should contain an isReachable function", function() {
		expect(2);
		ok(navigator.network.isReachable != null, "navigator.network.isReachable is null!");
		ok(typeof navigator.network.isReachable == 'function', "navigator.network.isReachable is not a function!");
	});
};