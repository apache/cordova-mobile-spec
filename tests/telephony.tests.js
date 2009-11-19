describe('Telephony functionality (navigator.telephony)', {
  'Should exist' : function() {
	value_of(navigator.telephony).should_not_be_null();
  },
  'Should have a send function' : function() {
	value_of(navigator.telephony).should_include('send');
	value_of(typeof navigator.telephony.send).should_be('function');
  }
})