describe('Camera functionality (navigator.camera)', {
	'Should exist' : function() {
		value_of(navigator.camera).should_not_be_null();
	},
	'Should have a getPicture function': function() {
		value_of(navigator.camera).should_include("getPicture");
		value_of(typeof navigator.camera.getPicture).should_be('function');
	}
})