Tests.prototype.AddressBookTests = function() {
	module('Address Book (navigator.AddressBook)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.AddressBook != null, "navigator.AddressBook should not be null.");
	});
	test("should contain an addContact function", function() {
		expect(2);
		ok(navigator.AddressBook.addContact != null, "navigator.AddressBook.addContact should not be null.");
		ok(typeof navigator.AddressBook.addContact == 'function', "navigator.AddressBook.addContact should be a function.");
	});
	test("should contain a removeContact function", function() {
		expect(2);
		ok(navigator.AddressBook.removeContact != null, "navigator.AddressBook.removeContact should not be null.");
		ok(typeof navigator.AddressBook.removeContact == 'function', "navigator.AddressBook.removeContact should be a function.");
	});
	test("should contain an updateContact function", function() {
		expect(2);
		ok(navigator.AddressBook.updateContact != null, "navigator.AddressBook.updateContact should not be null.");
		ok(typeof navigator.AddressBook.updateContact == 'function', "navigator.AddressBook.updateContact should be a function.");
	});
	test("should contain a findContacts function", function() {
		expect(2);
		ok(navigator.AddressBook.findContacts != null, "navigator.AddressBook.findContacts should not be null.");
		ok(typeof navigator.AddressBook.findContacts == 'function', "navigator.AddressBook.findContacts should be a function.");
	});
};