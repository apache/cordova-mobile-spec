Tests.prototype.NotificationTests = function() {	
	module('Notification (navigator.notification)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.notification != null, "navigator.notification should not be null.");
	});
	test("should contain a vibrate function", function() {
		expect(2);
		ok(navigator.notification.vibrate != null, "navigator.notification.vibrate should not be null.");
		ok(typeof navigator.notification.vibrate == 'function', "navigator.notification.vibrate should be a function.");
	});
	test("should contain a beep function", function() {
		expect(2);
		ok(navigator.notification.beep != null, "navigator.notification.beep should not be null.");
		ok(typeof navigator.notification.beep == 'function', "navigator.notification.beep should be a function.");
	});
};