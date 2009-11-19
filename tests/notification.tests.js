describe('Notification functionality (navigator.notification)', {
  'Should exist' : function() {
	value_of(navigator.notification).should_not_be_null();
  },
	'Should have a vibrate function': function() {
		value_of(navigator.notification).should_include("vibrate");
		value_of(typeof navigator.notification.vibrate).should_be('function');
	},
	'Should have a beep function': function() {
		value_of(navigator.notification).should_include("beep");
		value_of(typeof navigator.notification.beep).should_be('function');
	}
})