describe('Camera functionality (navigator.camera)', {
	'Should have a getPicture function': function() {
		value_of(navigator.camera).should_include("getPicture");
	}
})