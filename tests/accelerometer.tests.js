describe('Accelerometer functionality (navigator.accelerometer)', {
	'Should exist' : function() {
		value_of(navigator.accelerometer).should_not_be_null();
	},
	'Should have a getCurrentAcceleration function': function() {
		value_of(navigator.accelerometer).should_include("getCurrentAcceleration");
		value_of(typeof navigator.accelerometer.getCurrentAcceleration).should_be('function');
	},
	'Should have a watchAcceleration function': function() {
		value_of(navigator.accelerometer).should_include("watchAcceleration");
		value_of(typeof navigator.accelerometer.watchAcceleration).should_be('function');
	},
	'Should have a clearWatch function': function() {
		value_of(navigator.accelerometer).should_include("clearWatch");
		value_of(typeof navigator.accelerometer.clearWatch).should_be('function');
	}
})