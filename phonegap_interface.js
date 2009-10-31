/* Contact object representation */

function Contact() {
	this.firstName = "";
	this.lastName = "";
	this.phoneNumber = [
		{'label':'work','value':''},
		{'label':'mobile','value':''},
		{'label':'home','value':''}
	];
	this.email = [
		{'label':'work','value':''},
		{'label':'mobile','value':''},
		{'label':'home','value':''}
	];
	// Should address just be a string? BlackBerry, for example, stores specific sub-fields like street, city, country separately.
	// Need to compare how iPhone, Android, BlackBerry and Windows Mobile each organize address fields.
	this.address = "";
}