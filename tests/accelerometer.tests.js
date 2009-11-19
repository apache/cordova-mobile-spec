describe('Accelerometer functionality (navigator.accelerometer)', {
	'Should have a getCurrentAcceleration function': function() {
		value_of(navigator.accelerometer).should_include("getCurrentAcceleration");
	},
	'Should have a watchAcceleration function': function() {
		value_of(navigator.accelerometer).should_include("watchAcceleration");
	},
	'Should have a clearWatch function': function() {
		value_of(navigator.accelerometer).should_include("clearWatch");
	}
})