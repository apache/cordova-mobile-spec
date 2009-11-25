Tests.prototype.DeviceTests = function() {
	module('Device Information (window.device)');
	test("should exist", function() {
  		expect(1);
  		ok(window.device != null, "window.device is null!");
	});
	test("should contain a platform specification that is a string", function() {
		expect(2);
		ok(window.device.platform != null, "window.device.platform is null!")
		ok(typeof window.device.platform == 'string', "window.device.platform is not a string!")
	});
	test("should contain a version specification that is a string", function() {
		expect(2);
		ok(window.device.version != null, "window.device.version is null!")
		ok(typeof window.device.version == 'string', "window.device.version is not a string!")
	});
	test("should contain a name specification that is a string", function() {
		expect(2);
		ok(window.device.name != null, "window.device.name is null!")
		ok(typeof window.device.name == 'string', "window.device.name is not a string!")
	});
	test("should contain a UUID specification that is a string or a number", function() {
		expect(2);
		ok(window.device.uuid != null, "window.device.uuid is null!")
		if (typeof window.device.uuid == 'string') {
			ok(window.device.uuid.length > 0, "window.device.uuid, as a string, should have at least one character!")
		} else {
			ok(window.device.uuid > 0, "window.device.uuid, as a number, is not greater than 0!")
		}
	});
};