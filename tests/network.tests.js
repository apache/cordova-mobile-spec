Tests.prototype.NetworkTests = function() {
	module('Network (navigator.network)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.network != null, "navigator.network should not be null.");
	});
	test("should contain an isReachable function", function() {
		expect(2);
		ok(typeof navigator.network.isReachable != 'undefined' && navigator.network.isReachable != null, "navigator.network.isReachable should not be null.");
		ok(typeof navigator.network.isReachable == 'function', "navigator.network.isReachable should be a function.");
	});
	test("should define constants for network status", function() {
		expect(4);
		ok(NetworkStatus != null, "NetworkStatus object exists in global scope.");
		equals(NetworkStatus.NOT_REACHABLE, 0, "NetworkStatus.NOT_REACHABLE is equal to 0.");
		equals(NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK, 1, "NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK is equal to 1.");
		equals(NetworkStatus.REACHABLE_VIA_WIFI_NETWORK, 2, "NetworkStatus.REACHABLE_VIA_WIFI_NETWORK is equal to 2.");
	});
	test("isReachable function should return one of the defined NetworkStatus constants to its success callback", function() {
		expect(1);
		QUnit.stop(Tests.TEST_TIMEOUT);
		var hostname = "http://www.google.com";
		var win = function(code) {
			ok(code == NetworkStatus.NOT_REACHABLE || code == NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK || code == NetworkStatus.REACHABLE_VIA_WIFI_NETWORK, "Success callback in isReachable returns one of the defined NetworkStatus constants.");
			start();
		};
		navigator.network.isReachable(hostname, win);
	});
    module('Network Information API');
    test("connection should exist", function() {
        expect(1);
        ok(navigator.connection != null, "navigator.connection should not be null.");
    });
    test("should contain connection properties", function() {
        expect(3);
        ok(typeof navigator.connection.type != 'undefined', "navigator.connection.type is defined.");
        ok(typeof navigator.connection.homeNW != 'undefined', "navigator.connection.homeNW is defined.");
        ok(typeof navigator.connection.currentNW != 'undefined', "navigator.connection.currentNW is defined.");
    });
    test("should define constants for connection status", function() {
        expect(7);
        equals(Connection.UNKNOWN, 0, "Connection.UNKNOWN is equal to 0.");
        equals(Connection.ETHERNET, 1, "Connection.ETHERNET is equal to 1.");
        equals(Connection.WIFI, 2, "Connection.WIFI is equal to 2.");
        equals(Connection.CELL_2G, 3, "Connection.CELL_2G is equal to 3.");
        equals(Connection.CELL_3G, 4, "Connection.CELL_3G is equal to 4.");
        equals(Connection.CELL_4G, 5, "Connection.CELL_4G is equal to 5.");
        equals(Connection.NONE, 20, "Connection.NONE is equal to 20.");
    });
};