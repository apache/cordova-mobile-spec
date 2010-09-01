Tests.prototype.ContactsTests = function() {
	module("Contacts (navigator.service.contacts)");
	test("should exist", function() {
  		expect(1);
  		ok(navigator.service.contacts != null, "navigator.service.contacts should not be null.");
	});	
	test("should contain a find function", function() {
		expect(2);
		ok(typeof navigator.service.contacts.find != 'undefined' && navigator.service.contacts.find != null, "navigator.service.contacts.find should not be null.");
		ok(typeof navigator.service.contacts.find == 'function', "navigator.service.contacts.find should be a function.");
	});
	module("Contact model");
	test("should be able to define a Contact object", function() {
		expect(24);
		var contact = new Contact("a", "b", new ContactName("a", "b", "c", "d", "e", "f"), "c", [], [], [], [], [], "d", "e", "f", "g", "h", "i", "j", 
				[], [], [], [], [], "k", "l");
		ok(contact != null, "new Contact() should not be null.");
		ok(typeof contact.id != 'undefined' && contact.id != null && contact.id == "a", "new Contact() should include a 'id' property.");
		ok(typeof contact.displayName != 'undefined' && contact.displayName != null && contact.displayName == "b", "new Contact() should include a 'displayName' property.");
		ok(typeof contact.name != 'undefined' && contact.name != null && contact.name.formatted == "a", "new Contact() should include a 'name' property.");
		ok(typeof contact.nickname != 'undefined' && contact.nickname != null && contact.nickname == "c", "new Contact() should include a 'nickname' property.");
		ok(typeof contact.phoneNumbers != 'undefined' && contact.phoneNumbers != null, "new Contact() should include a 'phoneNumbers' property.");
		ok(typeof contact.emails != 'undefined' && contact.emails != null, "new Contact() should include a 'emails' property.");
		ok(typeof contact.addresses != 'undefined' && contact.addresses != null, "new Contact() should include a 'addresses' property.");
		ok(typeof contact.ims != 'undefined' && contact.ims != null, "new Contact() should include a 'ims' property.");
		ok(typeof contact.organizations != 'undefined' && contact.organizations != null, "new Contact() should include a 'organizations' property.");
		ok(typeof contact.published != 'undefined' && contact.published != null && contact.published == "d", "new Contact() should include a 'published' property.");
		ok(typeof contact.updated != 'undefined' && contact.updated != null && contact.updated == "e", "new Contact() should include a 'updated' property.");
		ok(typeof contact.birthday != 'undefined' && contact.birthday != null && contact.birthday == "f", "new Contact() should include a 'birthday' property.");
		ok(typeof contact.anniversary != 'undefined' && contact.anniversary != null && contact.anniversary == "g", "new Contact() should include a 'anniversary' property.");
		ok(typeof contact.gender != 'undefined' && contact.gender != null && contact.gender == "h", "new Contact() should include a 'gender' property.");
		ok(typeof contact.note != 'undefined' && contact.note != null && contact.note == "i", "new Contact() should include a 'note' property.");
		ok(typeof contact.preferredUsername != 'undefined' && contact.preferredUsername != null && contact.preferredUsername == "j", "new Contact() should include a 'preferredUsername' property.");
		ok(typeof contact.photos != 'undefined' && contact.photos != null, "new Contact() should include a 'photos' property.");
		ok(typeof contact.tags != 'undefined' && contact.tags != null, "new Contact() should include a 'tags' property.");
		ok(typeof contact.relationships != 'undefined' && contact.relationships != null, "new Contact() should include a 'relationships' property.");
		ok(typeof contact.urls != 'undefined' && contact.urls != null, "new Contact() should include a 'urls' property.");
		ok(typeof contact.accounts != 'undefined' && contact.accounts != null, "new Contact() should include a 'accounts' property.");
		ok(typeof contact.utcOffset != 'undefined' && contact.utcOffset != null && contact.utcOffset == "k", "new Contact() should include a 'utcOffset' property.");
		ok(typeof contact.connected != 'undefined' && contact.connected != null && contact.connected == "l", "new Contact() should include a 'connected' property.");
	});	
	test("should be able to define a ContactName object", function() {
		expect(7);
		var contactName = new ContactName("Dr. First Last Jr.", "Last", "First", "Middle", "Dr.", "Jr.");
		ok(contactName != null, "new ContactName() should not be null.");
		ok(typeof contactName.formatted != 'undefined' && contactName.formatted != null && contactName.formatted == "Dr. First Last Jr.", "new ContactName() should include a 'formatted' property.");
		ok(typeof contactName.familyName != 'undefined' && contactName.familyName != null && contactName.familyName == "Last", "new ContactName() should include a 'familyName' property.");
		ok(typeof contactName.givenName != 'undefined' && contactName.givenName != null && contactName.givenName == "First", "new ContactName() should include a 'givenName' property.");
		ok(typeof contactName.middleName != 'undefined' && contactName.middleName != null && contactName.middleName == "Middle", "new ContactName() should include a 'middleName' property.");
		ok(typeof contactName.honorificPrefix != 'undefined' && contactName.honorificPrefix != null && contactName.honorificPrefix == "Dr.", "new ContactName() should include a 'honorificPrefix' property.");
		ok(typeof contactName.honorificSuffix != 'undefined' && contactName.honorificSuffix != null && contactName.honorificSuffix == "Jr.", "new ContactName() should include a 'honorificSuffix' property.");
	});	
	test("should be able to define a ContactField object", function() {
		expect(4);
		var contactField = new ContactField("home", "8005551212", true);
		ok(contactField != null, "new ContactField() should not be null.");
		ok(typeof contactField.type != 'undefined' && contactField.type != null && contactField.type == "home", "new ContactField() should include a 'type' property.");
		ok(typeof contactField.value != 'undefined' && contactField.value != null && contactField.value == "8005551212", "new ContactField() should include a 'value' property.");
		ok(typeof contactField.primary != 'undefined' && contactField.primary != null && contactField.primary == true, "new ContactField() should include a 'primary' property.");
	});	
	test("should be able to define a ContactAddress object", function() {
		expect(7);
		var contactAddress = new ContactAddress("a","b","c","d","e","f");
		ok(contactAddress != null, "new ContactAddress() should not be null.");
		ok(typeof contactAddress.formatted != 'undefined' && contactAddress.formatted != null && contactAddress.formatted == "a", "new ContactAddress() should include a 'formatted' property.");
		ok(typeof contactAddress.streetAddress != 'undefined' && contactAddress.streetAddress != null && contactAddress.streetAddress == "b", "new ContactAddress() should include a 'streetAddress' property.");
		ok(typeof contactAddress.locality != 'undefined' && contactAddress.locality != null && contactAddress.locality == "c", "new ContactAddress() should include a 'locality' property.");
		ok(typeof contactAddress.region != 'undefined' && contactAddress.region != null && contactAddress.region == "d", "new ContactAddress() should include a 'region' property.");
		ok(typeof contactAddress.postalCode != 'undefined' && contactAddress.postalCode != null && contactAddress.postalCode == "e", "new ContactAddress() should include a 'postalCode' property.");
		ok(typeof contactAddress.country != 'undefined' && contactAddress.country != null && contactAddress.country == "f", "new ContactAddress() should include a 'country' property.");
	});	
	test("should be able to define a ContactOrganization object", function() {
		expect(8);
		var contactOrg = new ContactOrganization("a","b","c","d","e","f","g");
		ok(contactOrg != null, "new ContactOrganization() should not be null.");
		ok(typeof contactOrg.name != 'undefined' && contactOrg.name != null && contactOrg.name == "a", "new ContactOrganization() should include a 'name' property.");
		ok(typeof contactOrg.department != 'undefined' && contactOrg.department != null && contactOrg.department == "b", "new ContactOrganization() should include a 'department' property.");
		ok(typeof contactOrg.title != 'undefined' && contactOrg.title != null && contactOrg.title == "c", "new ContactOrganization() should include a 'title' property.");
		ok(typeof contactOrg.startDate != 'undefined' && contactOrg.startDate != null && contactOrg.startDate == "d", "new ContactOrganization() should include a 'startDate' property.");
		ok(typeof contactOrg.endDate != 'undefined' && contactOrg.endDate != null && contactOrg.endDate == "e", "new ContactOrganization() should include a 'endDate' property.");
		ok(typeof contactOrg.location != 'undefined' && contactOrg.location != null && contactOrg.location == "f", "new ContactOrganization() should include a 'location' property.");
		ok(typeof contactOrg.description != 'undefined' && contactOrg.description != null && contactOrg.description == "g", "new ContactOrganization() should include a 'description' property.");
	});	
	test("should be able to define a ContactAccount object", function() {
		expect(4);
		var contactAccount = new ContactAccount("a", "b", "c");
		ok(contactAccount != null, "new ContactAccount() should not be null.");
		ok(typeof contactAccount.domain != 'undefined' && contactAccount.domain != null && contactAccount.domain == "a", "new ContactAccount() should include a 'domain' property.");
		ok(typeof contactAccount.username != 'undefined' && contactAccount.username != null && contactAccount.username == "b", "new ContactAccount() should include a 'username' property.");
		ok(typeof contactAccount.userid != 'undefined' && contactAccount.userid != null && contactAccount.userid == "c", "new ContactAccount() should include a 'userid' property.");
	});	
};
