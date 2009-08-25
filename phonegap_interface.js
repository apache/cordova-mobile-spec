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
	this.address = "";
}