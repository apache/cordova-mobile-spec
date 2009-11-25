Tests.prototype.GeoLocationTests = function() {	
	module('Geolocation (navigator.geolocation)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.geolocation != null, "navigator.geolocation is null!");
	});
	test("should have an initially null lastPosition property", function() {
  		expect(1);
  		ok(navigator.geolocation.lastPosition == null, "navigator.geolocation.lastPosition is not initially null!");
	});
	test("should contain a getCurrentPosition function", function() {
		expect(2);
		ok(navigator.geolocation.getCurrentPosition != null, "navigator.geolocation.getCurrentPosition is null!");
		ok(typeof navigator.geolocation.getCurrentPosition == 'function', "navigator.geolocation.getCurrentPosition is not a function!");
	});
	test("should contain a watchPosition function", function() {
		expect(2);
		ok(navigator.geolocation.watchPosition != null, "navigator.geolocation.watchPosition is null!");
		ok(typeof navigator.geolocation.watchPosition == 'function', "navigator.geolocation.watchPosition is not a function!");
	});
	// TODO: Test callbacks for geo.
	module('Geolocation model');
	test("should be able to define a Position object with coords and timestamp properties", function() {
		expect(3);
		var pos = new Position();
		ok(pos != null, "new Position() is null!");
		ok(pos.coords != null, "new Position() does not include a 'coords' property!");
		ok(pos.timestamp != null, "new Position() does not include a 'timestamp' property!");
	});
	test("should be able to define a Coordinates object with latitude, longitude, accuracy, altitude, heading and speed properties", function() {
		expect(8);
		var coords = new Coordinates(1,2,3,4,5,6,7);
		ok(coords != null, "new Coordinates() is null!");
		ok(coords.latitude != null, "new Coordinates() does not include a 'latitude' property!");
		ok(coords.longitude != null, "new Coordinates() does not include a 'longitude' property!");
		ok(coords.accuracy != null, "new Coordinates() does not include a 'accuracy' property!");
		ok(coords.altitude != null, "new Coordinates() does not include a 'altitude' property!");
		ok(coords.heading != null, "new Coordinates() does not include a 'heading' property!");
		ok(coords.speed != null, "new Coordinates() does not include a 'speed' property!");
	});
};