Tests.prototype.GeoLocationTests = function() {	
	module('Geolocation (navigator.geolocation)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.geolocation != null, "navigator.geolocation should not be null.");
	});
	test("should have an initially null lastPosition property", function() {
  		expect(1);
  		ok(navigator.geolocation.lastPosition == null, "navigator.geolocation.lastPosition should be initially null.");
	});
	test("should contain a getCurrentPosition function", function() {
		expect(2);
		ok(navigator.geolocation.getCurrentPosition != null, "navigator.geolocation.getCurrentPosition should not be null.");
		ok(typeof navigator.geolocation.getCurrentPosition == 'function', "navigator.geolocation.getCurrentPosition should be a function.");
	});
	test("should contain a watchPosition function", function() {
		expect(2);
		ok(navigator.geolocation.watchPosition != null, "navigator.geolocation.watchPosition should not be null.");
		ok(typeof navigator.geolocation.watchPosition == 'function', "navigator.geolocation.watchPosition should be a function.");
	});
	// TODO: Test callbacks for geo.
	module('Geolocation model');
	test("should be able to define a Position object with coords and timestamp properties", function() {
		expect(3);
		var pos = new Position();
		ok(pos != null, "new Position() should not be null.");
		ok(pos.coords != null, "new Position() should include a 'coords' property.");
		ok(pos.timestamp != null, "new Position() should include a 'timestamp' property.");
	});
	test("should be able to define a Coordinates object with latitude, longitude, accuracy, altitude, heading and speed properties", function() {
		expect(7);
		var coords = new Coordinates(1,2,3,4,5,6,7);
		ok(coords != null, "new Coordinates() should not be null.");
		ok(coords.latitude != null, "new Coordinates() should include a 'latitude' property.");
		ok(coords.longitude != null, "new Coordinates() should include a 'longitude' property.");
		ok(coords.accuracy != null, "new Coordinates() should include a 'accuracy' property.");
		ok(coords.altitude != null, "new Coordinates() should include a 'altitude' property.");
		ok(coords.heading != null, "new Coordinates() should include a 'heading' property.");
		ok(coords.speed != null, "new Coordinates() should include a 'speed' property.");
	});
};