Tests.prototype.AccelerometerTests = function() {
	module('Accelerometer (navigator.accelerometer)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.accelerometer != null, "navigator.accelerometer is null!");
	});
	test("should contain a getCurrentAcceleration function", function() {
		expect(2);
		ok(navigator.accelerometer.getCurrentAcceleration != null, "navigator.accelerometer.getCurrentAcceleration is null!");
		ok(typeof navigator.accelerometer.getCurrentAcceleration == 'function', "navigator.accelerometer.getCurrentAcceleration is not a function!");
	});
	test("should contain a watchAcceleration function", function() {
		expect(2);
		ok(navigator.accelerometer.watchAcceleration != null, "navigator.accelerometer.watchAcceleration is null!");
		ok(typeof navigator.accelerometer.watchAcceleration == 'function', "navigator.accelerometer.watchAcceleration is not a function!");
	});
	test("should contain a clearWatch function", function() {
		expect(2);
		ok(navigator.accelerometer.clearWatch != null, "navigator.accelerometer.clearWatch is null!");
		ok(typeof navigator.accelerometer.clearWatch == 'function', "navigator.accelerometer.clearWatch is not a function!");
	});
};