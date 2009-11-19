describe('File functionality (navigator.file)', {
	'Should include a read and write method': function() {
		value_of(navigator.file).should_include("read");
		value_of(navigator.file).should_include("write");
	}
})