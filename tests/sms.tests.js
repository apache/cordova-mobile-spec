Tests.prototype.SMSTests = function() {	
	module('SMS (navigator.sms)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.sms != null, "navigator.sms is null!");
	});
	test("should contain a send function", function() {
		expect(2);
		ok(navigator.sms.send != null, "navigator.sms.send is null!");
		ok(typeof navigator.sms.send == 'function', "navigator.sms.send is not a function!");
	});
};