describe('SMS functionality (navigator.sms)', {
  'Should exist' : function() {
	value_of(navigator.sms).should_not_be_null();
  },
	'Should have a send function': function() {
		value_of(navigator.sms).should_include("send");
		value_of(typeof navigator.sms.send).should_be('function');
	}
})