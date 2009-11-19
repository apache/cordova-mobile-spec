describe('Address Book functionality (navigator.AddressBook)', {
  'Should define the AddressBook with the CRUD functions' : function() {
	value_of(navigator.AddressBook).should_not_be_null();
    value_of(navigator.AddressBook).should_include('addContact');
    value_of(navigator.AddressBook).should_include('removeContact');
    value_of(navigator.AddressBook).should_include('findContacts'); 
  }
})