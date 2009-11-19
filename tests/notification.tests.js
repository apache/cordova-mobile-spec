describe('Notification functionality (navigator.notification)', {
	'Should have a vibrate function': function() {
		value_of(navigator.notification).should_include("vibrate");
	},
	'Should have a beep function': function() {
		value_of(navigator.notification).should_include("beep");
	}
})