Tests.prototype.MediaTests = function() {	
	module('Media (Audio)');
	test("should exist", function() {
  		expect(1);
  		ok(typeof Audio == "function", "'Audio' should be defined as a function in global scope.");
	});
	test("should contain 'src', 'autoplay', 'loop' and 'error' properties", function() {
  		expect(9);
		var audioSrc = '/test.mp3';
		var audio = new Audio(audioSrc);
  		ok(typeof audio == "object", "Instantiated 'Audio' object instance should be of type 'object.'");
		ok(audio.src != null && audio.src != undefined, "Instantiated 'Audio' object's 'src' property should not be null or undefined.");
		ok(audio.src == audioSrc, "Instantiated 'Audio' object's 'src' property should match constructor parameter.");
		ok(audio.autoplay != null && audio.autoplay != undefined, "Instantiated 'Audio' object's 'autoplay' property should not be null or undefined.");
		ok(audio.autoplay == false, "Instantiated 'Audio' object's 'autoplay' property should initially be false.");
		ok(audio.loop != null && audio.loop != undefined, "Instantiated 'Audio' object's 'loop' property should not be null or undefined.");
		ok(audio.loop == false, "Instantiated 'Audio' object's 'loop' property should initially be false.");
		ok(audio.error != undefined, "Instantiated 'Audio' object's 'error' property should not undefined.");
		ok(audio.error == null, "Instantiated 'Audio' object's 'error' should initially be null.");
	});
	test("should define constants for Media errors", function() {
		expect(5);
		ok(MediaError != null && MediaError != undefined, "MediaError object exists in global scope.");
		equals(MediaError.MEDIA_ERR_ABORTED, 1, "MediaError.MEDIA_ERR_ABORTED is equal to 1.");
		equals(MediaError.MEDIA_ERR_NETWORK, 2, "MediaError.MEDIA_ERR_NETWORK is equal to 2.");
		equals(MediaError.MEDIA_ERR_DECODE, 3, "MediaError.MEDIA_ERR_DECODE is equal to 3.");
		equals(MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED, 4, "MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED is equal to 4.");
	});
};