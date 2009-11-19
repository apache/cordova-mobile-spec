describe('Address Book functionality (navigator.AddressBook)', {
  'Should exist' : function() {
	value_of(navigator.AddressBook).should_not_be_null();
  },
  'Should define the AddressBook with the CRUD functions' : function() {
    value_of(navigator.AddressBook).should_include('addContact');
	value_of(typeof navigator.AddressBook.addContact).should_be('function');
    value_of(navigator.AddressBook).should_include('removeContact');
	value_of(typeof navigator.AddressBook.removeContact).should_be('function');
    value_of(navigator.AddressBook).should_include('findContacts'); 
	value_of(typeof navigator.AddressBook.findContacts).should_be('function');
  }
})