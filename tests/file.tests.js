describe('File functionality (navigator.file)', {
  'Should exist' : function() {
	value_of(navigator.file).should_not_be_null();
  },
	'Should include a read and write method': function() {
		value_of(navigator.file).should_include("read");
		value_of(typeof navigator.file.read).should_be('function');
		value_of(navigator.file).should_include("write");
		value_of(typeof navigator.file.write).should_be('function');
	}
})