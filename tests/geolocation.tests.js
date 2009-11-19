describe('Geolocation functionality (navigator.geolocation)', {
	'Should exist' : function() {
		value_of(navigator.geolocation).should_not_be_null();
	},
	'Should have an initially null lastPosition property': function() {
		value_of(navigator.geolocation.lastPosition).should_be_null(); 
	},
	'Should have a callbacks object': function() {
		value_of(navigator.geolocation).should_include("callbacks");
	},
	'Should have a getCurrentPosition function': function() {
		value_of(navigator.geolocation).should_include("getCurrentPosition");
		value_of(typeof navigator.geolocation.getCurrentPosition).should_be('function');
	},
	'Should have a watchPosition function': function() {
		value_of(navigator.geolocation).should_include("watchPosition");
		value_of(typeof navigator.geolocation.watchPosition).should_be('function');
	},
	'Should return Position objects from its getCurrentPosition function': function() {
		var win = function(position) {
			value_of(position).should_not_be_null();
			value_of(position).should_include("coords");
			value_of(position).should_include("timestamp");
			value_of(typeof position.timestamp).should_be();
		};
		var fail = function() {
			// Failing is expected behaviour, but we need to be able to control the conditions surrounding failure.
		};
		navigator.geolocation.getCurrentPosition(win, fail, {});
	}
})
describe('Geolocation model', {
	'Should define a Position object with coords and timestamp properties': function() {
		var pos = new Position({});
		value_of(pos).should_not_be_null();
		value_of(pos).should_include("coords");
		value_of(pos).should_include("timestamp");
	},
	'Should define a Coordinates object with latitude, longitude, accuracy, altitude, heading and speed properties': function() {
		var coords = new Coordinates(1,2,3,4,5,6,7);
		value_of(coords).should_not_be_null();
		value_of(coords).should_include("latitude");
		value_of(coords).should_include("longitude");
		value_of(coords).should_include("altitude");
		value_of(coords).should_include("accuracy");
		value_of(coords).should_include("altaccuracy");
		value_of(coords).should_include("heading");
		value_of(coords).should_include("speed");
	}
})