Tests.prototype.AccelerometerTests = function() {
	module('Accelerometer (navigator.accelerometer)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.accelerometer != null, "navigator.accelerometer should not be null.");
	});
	test("should contain a getCurrentAcceleration function", function() {
		expect(2);
		ok(navigator.accelerometer.getCurrentAcceleration != null, "navigator.accelerometer.getCurrentAcceleration should not be null.");
		ok(typeof navigator.accelerometer.getCurrentAcceleration == 'function', "navigator.accelerometer.getCurrentAcceleration should be a function.");
	});
	test("should contain a watchAcceleration function", function() {
		expect(2);
		ok(navigator.accelerometer.watchAcceleration != null, "navigator.accelerometer.watchAcceleration should not be null.");
		ok(typeof navigator.accelerometer.watchAcceleration == 'function', "navigator.accelerometer.watchAcceleration should be a function.");
	});
	test("should contain a clearWatch function", function() {
		expect(2);
		ok(navigator.accelerometer.clearWatch != null, "navigator.accelerometer.clearWatch should not be null.");
		ok(typeof navigator.accelerometer.clearWatch == 'function', "navigator.accelerometer.clearWatch should be a function!");
	});
};