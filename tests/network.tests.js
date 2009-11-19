describe('Network functionality (navigator.network)', {
	'Should have a isReachable function': function() {
		value_of(navigator.network).should_include("isReachable");
	}
})