describe('Network functionality (navigator.network)', {
	'Should exist' : function() {
		value_of(navigator.network).should_not_be_null();
	},
	'Should have a isReachable function': function() {
		value_of(navigator.network).should_include("isReachable");
		value_of(typeof navigator.network.isReachable).should_be('function');
	}
})