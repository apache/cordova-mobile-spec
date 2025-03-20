Tests.prototype.WebSocketTests = function() {
	module('WebSocket model');
	test("should be able to define a WebSocket object", function() {
		expect(1);
		try {
			var websocket = new WebSocket('ws://localhost/');
			ok(websocket != null, "new WebSocket('valid-url') should not be null.");
			websocket.close();
		} catch (e) {
		}
	});
	test("should throw errors if 'url is invalid'", function() {
		expect(1);
		try {
			var websocket = new WebSocket('--invalid--');
		} catch (e) {
			ok(e != null, "new WebSocket('valid-url') should throw error.");
		}
	});
    test("should contain a 'send' function", function() {
        expect(2);
        var websocket = new WebSocket('ws://localhost/');
        ok(typeof websocket.send != 'undefined' && websocket.send != null, "websocket.send should not be null.");
        ok(typeof websocket.send == 'function', "websocket.send should be a function.");
        websocket.close();
    });
    test("should contain a 'close' function", function() {
        expect(2);
        var websocket = new WebSocket('ws://localhost/');
        ok(typeof websocket.close != 'undefined' && websocket.close != null, "websocket.close should not be null.");
        ok(typeof websocket.close == 'function', "websocket.close should be a function.");
        websocket.close();
    });
    test("should contain a 'onopen' function", function() {
        expect(2);
        var websocket = new WebSocket('ws://localhost/');
        ok(typeof websocket.onopen != 'undefined' && websocket.onopen != null, "websocket.onopen should not be null.");
        ok(typeof websocket.onopen == 'function', "websocket.onopen should be a function.");
        websocket.close();
    });
    test("should contain a 'onclose' function", function() {
        expect(2);
        var websocket = new WebSocket('ws://localhost/');
        ok(typeof websocket.onclose != 'undefined' && websocket.onclose != null, "websocket.onclose should not be null.");
        ok(typeof websocket.onclose == 'function', "websocket.onclose should be a function.");
        websocket.close();
    });
    test("should contain a 'onerror' function", function() {
        expect(2);
        var websocket = new WebSocket('ws://localhost/');
        ok(typeof websocket.onerror != 'undefined' && websocket.onerror != null, "websocket.onerror should not be null.");
        ok(typeof websocket.onerror == 'function', "websocket.onerror should be a function.");
        websocket.close();
    });
    test("should contain a 'onmessage' function", function() {
        expect(2);
        var websocket = new WebSocket('ws://localhost/');
        ok(typeof websocket.onmessage != 'undefined' && websocket.onmessage != null, "websocket.onmessage should not be null.");
        ok(typeof websocket.onmessage == 'function', "websocket.onmessage should be a function.");
        websocket.close();
    });	
};
