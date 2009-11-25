Tests.prototype.FileTests = function() {	
	module('File I/O (navigator.file)');
	test("should exist", function() {
  		expect(1);
  		ok(navigator.file != null, "navigator.file is null!");
	});
	test("should contain a read function", function() {
		expect(2);
		ok(navigator.file.read != null, "navigator.file.read is null!");
		ok(typeof navigator.file.read == 'function', "navigator.file.read is not a function!");
	});
	test("should contain a write function", function() {
		expect(2);
		ok(navigator.file.write != null, "navigator.file.write is null!");
		ok(typeof navigator.file.write == 'function', "navigator.file.write is not a function!");
	});
};