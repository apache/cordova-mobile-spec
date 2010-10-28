Tests.prototype.FileTests = function() {	
	module('FileReader model');
	test("should be able to define a FileReader object", function() {
  		expect(1);
  		var reader = new FileReader();
  		ok(reader != null, "new FileReader() should not be null.");
	});
	test("should contain a readAsBinaryString function", function() {
		expect(2);
  		var reader = new FileReader();
		ok(typeof reader.readAsBinaryString != 'undefined' && reader.readAsBinaryString != null, "reader.readAsBinaryString should not be null.");
		ok(typeof reader.readAsBinaryString == 'function', "reader.readAsBinaryString should be a function.");
	});
	test("should contain a readAsDataURL function", function() {
		expect(2);
  		var reader = new FileReader();
		ok(typeof reader.readAsDataURL != 'undefined' && reader.readAsDataURL != null, "reader.readAsDataURL should not be null.");
		ok(typeof reader.readAsDataURL == 'function', "reader.readAsDataURL should be a function.");
	});
	test("should contain a readAsText function", function() {
		expect(2);
  		var reader = new FileReader();
		ok(typeof reader.readAsText != 'undefined' && reader.readAsText != null, "reader.readAsText should not be null.");
		ok(typeof reader.readAsText == 'function', "reader.readAsText should be a function.");
	});
	test("should contain a readAsArrayBuffer function", function() {
		expect(2);
  		var reader = new FileReader();
		ok(typeof reader.readAsArrayBuffer != 'undefined' && reader.readAsArrayBuffer != null, "reader.readAsArrayBuffer should not be null.");
		ok(typeof reader.readAsArrayBuffer == 'function', "reader.readAsArrayBuffer should be a function.");
	});
	test("should contain a abort function", function() {
		expect(2);
  		var reader = new FileReader();
		ok(typeof reader.abort != 'undefined' && reader.abort != null, "reader.abort should not be null.");
		ok(typeof reader.abort == 'function', "reader.abort should be a function.");
	});
	module('FileWriter model');
	test("should be able to define a FileWriter object", function() {
  		expect(1);
  		var writer = new FileWriter();
  		ok(writer != null, "new FileWriter() should not be null.");
	});
	test("should contain a write function", function() {
		expect(2);
  		var writer = new FileWriter();
		ok(typeof writer.write != 'undefined' && writer.write != null, "writer.write should not be null.");
		ok(typeof writer.write == 'function', "writer.write should be a function.");
	});
	test("should contain a seek function", function() {
		expect(2);
  		var writer = new FileWriter();
		ok(typeof writer.seek != 'undefined' && writer.seek != null, "writer.seek should not be null.");
		ok(typeof writer.seek == 'function', "writer.seek should be a function.");
	});
	test("should contain a truncate function", function() {
		expect(2);
  		var writer = new FileWriter();
		ok(typeof writer.truncate != 'undefined' && writer.truncate != null, "writer.truncate should not be null.");
		ok(typeof writer.truncate == 'function', "writer.truncate should be a function.");
	});
	test("should contain a abort function", function() {
		expect(2);
  		var writer = new FileWriter();
		ok(typeof writer.abort != 'undefined' && writer.abort != null, "writer.abort should not be null.");
		ok(typeof writer.abort == 'function', "writer.abort should be a function.");
	});
	
};