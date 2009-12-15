Tests.prototype.DeviceTests = function() {
	module('Device Information (window.device)');
	test("should exist", function() {
  		expect(1);
  		ok(window.device != null, "window.device should not be null.");
	});
	test("should contain a platform specification that is a string", function() {
		expect(2);
		ok(typeof window.device.platform != 'undefined' && window.device.platform != null, "window.device.platform should not be null.")
		ok(typeof window.device.platform == 'string', "window.device.platform should be a string.")
	});
	test("should contain a version specification that is a string", function() {
		expect(2);
		ok(typeof window.device.version != 'undefined' && window.device.version != null, "window.device.version should not be null.")
		ok(typeof window.device.version == 'string', "window.device.version should be a string.")
	});
	test("should contain a name specification that is a string", function() {
		expect(2);
		ok(typeof window.device.name != 'undefined' && window.device.name != null, "window.device.name should not be null.")
		ok(typeof window.device.name == 'string', "window.device.name should be a string.")
	});
	test("should contain a UUID specification that is a string or a number", function() {
		expect(2);
		ok(typeof window.device.uuid != 'undefined' && window.device.uuid != null, "window.device.uuid should not be null.")
		if (typeof window.device.uuid == 'string') {
			ok(window.device.uuid.length > 0, "window.device.uuid, as a string, should have at least one character.")
		} else {
			ok(window.device.uuid > 0, "window.device.uuid, as a number, should be greater than 0. (should it, even?)")
		}
	});
};