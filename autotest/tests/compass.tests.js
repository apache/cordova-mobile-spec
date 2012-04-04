describe('Compass (navigator.compass)', function () {
	it("should exist", function() {
      expect(navigator.compass).toBeDefined();
	});

	it("should contain a getCurrentHeading function", function() {
        expect(navigator.compass.getCurrentHeading).toBeDefined();
		expect(typeof navigator.compass.getCurrentHeading == 'function').toBe(true);
	});
<<<<<<< HEAD
	test("getCurrentHeading success callback should be called with a Heading object", function() {
		expect(9);
		QUnit.stop(Tests.TEST_TIMEOUT);
		var win = function(a) {
			ok(a instanceof CompassHeading, "Heading object returned in getCurrentHeading success callback should be an instance of CompassHeading.");
			ok(a.magneticHeading !== null, "Heading object returned in getCurrentHeading success callback should have an 'magneticHeading' property.");
			ok(typeof a.magneticHeading == 'number', "Heading object's 'magneticHeading' property returned in getCurrentHeading success callback should be of type 'number'.");
			ok(a.trueHeading !== undefined, "Heading object returned in getCurrentHeading success callback should have a 'trueHeading' property.");
			ok(typeof a.trueHeading == 'number' || a.trueHeading === null, "Heading object's 'trueHeading' property returned in getCurrentHeading success callback should be of type 'number', or should be null if not available.");
			ok(a.headingAccuracy !== undefined, "Heading object returned in getCurrentHeading success callback should have a 'headingAccuracy' property.");
			ok(typeof a.headingAccuracy == 'number' || a.headingAccuracy === null, "Heading object's 'headingAccuracy' property returned in getCurrentHeading success callback should be of type 'number', or should be null if not available.");
			ok(a.timestamp !== null, "Heading object returned in getCurrentHeading success callback should have a 'timestamp' property.");
			ok(typeof a.timestamp == 'number', "Heading object's 'timestamp' property returned in getCurrentHeading success callback should be of type 'number'.");
			QUnit.start();
		};
		var fail = function() { QUnit.start(); };
		navigator.compass.getCurrentHeading(win, fail);
=======

	it("getCurrentHeading success callback should be called with a Heading object", function() {
		var win = jasmine.createSpy().andCallFake(function(a) {
                expect(a instanceof CompassHeading).toBe(true);
                expect(a.magneticHeading).toBeDefined();
                expect(typeof a.magneticHeading == 'number').toBe(true);
                expect(a.trueHeading).not.toBe(undefined);
                expect(typeof a.trueHeading == 'number' || a.trueHeading === null).toBe(true);
                expect(a.headingAccuracy).not.toBe(undefined);
                expect(typeof a.headingAccuracy == 'number' || a.headingAccuracy === null).toBe(true);
                expect(a.timestamp instanceof Date).toBe(true);
            }),
            fail = jasmine.createSpy();

        runs(function () {
		    navigator.compass.getCurrentHeading(win, fail);
        });

        waitsFor(function () { return win.wasCalled; }, "win never called", Tests.TEST_TIMEOUT);

        runs(function () {
            expect(fail).not.toHaveBeenCalled();
        });
>>>>>>> converted some more tests to jasmine
	});

	it("should contain a watchHeading function", function() {
        expect(navigator.compass.watchHeading).toBeDefined();
		expect(typeof navigator.compass.watchHeading == 'function').toBe(true);
	});

	it("should contain a clearWatch function", function() {
        expect(navigator.compass.clearWatch).toBeDefined();
		expect(typeof navigator.compass.clearWatch == 'function').toBe(true);
	});

    describe('Compass Constants (window.CompassError)', function () {
        it("CompassError globals should exist", function() {
            expect(window.CompassError).toBeDefined();
            expect(window.CompassError.COMPASS_INTERNAL_ERR).toBe(0);
            expect(window.CompassError.COMPASS_NOT_SUPPORTED).toBe(20);
        });
    });

    describe('Compass Heading model (CompassHeading)', function () {
        it("CompassHeading function should exist", function() {
            expect(CompassHeading).toBeDefined();
        });

        it("Creating a new CompassHeading instance with no parameters", function() {
            var h = new CompassHeading();
            expect(h.magneticHeading).toBeDefined();
            expect(h.trueHeading).toBeDefined();
            expect(h.headingAccuracy).toBeDefined();
            expect(h.timestamp instanceof Date).toBe(true);
        });

<<<<<<< HEAD
  module('Compass Heading model (CompassHeading)');
  test("CompassHeading function should exist", function() {
    expect(1);
    ok(typeof CompassHeading != 'undefined' && CompassHeading !== null, 'CompassHeading should not be null');
  });
  test("Creating a new CompassHeading instance with no parameters", function() {
    expect(5);
    var h = new CompassHeading();
    equals(h.magneticHeading, null, "CompassHeading instance should have null magneticHeading property by default");
    equals(h.trueHeading, null, "CompassHeading instance should have null trueHeading property by default");
    equals(h.headingAccuracy, null, "CompassHeading instance should have null headingAccuracy property by default");
    ok(h.timestamp !== null, "CompassHeading instance should have timestamp that is not null by default");
    ok(typeof h.timestamp == 'number', "CompassHeading instance should have timestamp that is a number.");
  });
  test("Creating a new CompassHeading instance with parameters", function() {
    expect(5);
    var h = new CompassHeading(1,2,3,4);
    equals(h.magneticHeading, 1, "CompassHeading instance should have specified magneticHeading.");
    equals(h.trueHeading, 2, "CompassHeading instance should have specified trueHeading.");
    equals(h.headingAccuracy, 3, "CompassHeading instance should have specified headingAccuracy.");
    equals(h.timestamp.valueOf(), 4, "CompassHeading instance should have specified timestamp.");
    ok(typeof h.timestamp == 'number', "CompassHeading instance should have timestamp that is a number");
  });
};
=======
        it("Creating a new CompassHeading instance with parameters", function() {
            var h = new CompassHeading(1,2,3,4);
            expect(h.magneticHeading).toBe(1);
            expect(h.trueHeading).toBe(2);
            expect(h.headingAccuracy).toBe(3);
            expect(h.timestamp.valueOf()).toBe(4);
            expect(h.timestamp instanceof Date).toBe(true);
        });
    });
});
>>>>>>> converted some more tests to jasmine
