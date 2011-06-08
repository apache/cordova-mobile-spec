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
        ok(navigator.network.connection != null, "navigator.network.connection should not be null.");
    });
    test("should contain connection properties", function() {
        expect(1);
        ok(typeof navigator.network.connection.type != 'undefined', "navigator.network.connection.type is defined.");
    });
    test("should define constants for connection status", function() {
        expect(7);
        equals(Connection.UNKNOWN, "unknown", "Connection.UNKNOWN is equal to 'unknown'.");
        equals(Connection.ETHERNET, "ethernet", "Connection.ETHERNET is equal to 'ethernet'.");
        equals(Connection.WIFI, "wifi", "Connection.WIFI is equal to 'wifi'.");
        equals(Connection.CELL_2G, "2g", "Connection.CELL_2G is equal to '2g'.");
        equals(Connection.CELL_3G, "3g", "Connection.CELL_3G is equal to '3g'.");
        equals(Connection.CELL_4G, "4g", "Connection.CELL_4G is equal to '4g'.");
        equals(Connection.NONE, "none", "Connection.NONE is equal to 'none'.");
    });
};