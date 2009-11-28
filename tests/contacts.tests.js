Tests.prototype.ContactsTests = function() {
	module('Contacts (navigator.contacts)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.contacts != null, "navigator.contacts should not be null.");
	});
	test("should contain a find function", function() {
		expect(2);
		ok(navigator.contacts.find != null, "navigator.contacts.find should not be null.");
		ok(typeof navigator.contacts.find == 'function', "navigator.contacts.find should be a function.");
	});
};