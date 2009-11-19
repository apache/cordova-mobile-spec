describe('SMS functionality (navigator.sms)', {
	'Should have a send function': function() {
		value_of(navigator.sms).should_include("send");
	}
})