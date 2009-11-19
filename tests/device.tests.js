describe('Device information (window.device)', {
	'Should exist' : function() {
		value_of(window.device).should_not_be_null();
	},
	'Should contain a platform specification': function() {
		value_of(window.device.platform).should_have_at_least(1,"characters");
	},
	'Should contain a version specification': function() {
		value_of(window.device.version).should_have_at_least(1,"characters");
	},
	'Should contain a name specification': function() {
		value_of(window.device.name).should_have_at_least(1,"characters");
	},
	'Should contain a UUID specification': function() {
		value_of(window.device.uuid).should_have_at_least(1,"characters");
	}
})