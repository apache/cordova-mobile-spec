/**
 * Retrieves root file system entries once, so it doesn't have to be 
 * repeated for every test (file system won't change during test run). 
 */ 
var getFileSystemRoot = (function() {

    // private
    var temp_root, persistent_root;

    var onError = function(error) {
        console.log('unable to retrieve file system: ' + error.code);
    };
    
    // one-time retrieval of the root file system entry
    var init = function() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem) {
                    persistent_root = fileSystem.root;
                }, onError);
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
                function(fileSystem) {
                    temp_root = fileSystem.root;
                }, onError);
    };
    document.addEventListener("deviceready", init, true); 

    // public function returns private root entry
    return function(type) {
        if (type === LocalFileSystem.TEMPORARY) {
            return temp_root;
        }
        else if (type === LocalFileSystem.PERSISTENT) {
            return persistent_root;
        }
        else {
            return null;
        }
    };
}()); // execute immediately

Tests.prototype.FileTests = function() {
    module('FileReader model');
    test("FileReader object should have correct methods", function() {
        expect(6);
        var reader = new FileReader();
        ok(reader !== null, "new FileReader() should not be null.");
        ok(typeof reader.readAsBinaryString === 'function', "FileReader object should have a readAsBinaryString function.");
        ok(typeof reader.readAsDataURL === 'function', "FileReader object should have a readAsDataURL function.");
        ok(typeof reader.readAsText === 'function', "FileReader object should have a readAsText function.");
        ok(typeof reader.readAsArrayBuffer === 'function', "FileReader object should have a readAsArrayBuffer function.");
        ok(typeof reader.abort === 'function', "FileReader object should have an abort function.");
    });
    module('FileReader read', {
        setup: function() {
            this.root = getFileSystemRoot(LocalFileSystem.PERSISTENT); 
            this.fail = function(error) {
                console.log('file error: ' + error.code);
            };            
        }
    });
    test("should read file properly", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(1);
            
            // path of file
        var fileName = "read.txt",
            filePath = this.root.fullPath + '/' + fileName;
            // file content
            rule = "There is an exception to every rule.  Except this one.",
            // creates a FileWriter object
            create_writer = function(fileEntry) {
                fileEntry.createWriter(write_file, this.fail);
            },
            // writes file and reads it back in
            write_file = function(writer) {
                writer.onwriteend = read_file; 
                writer.write(rule);
            },
            // reads file and compares content to what was written
            read_file = function(evt) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    console.log("read success");
                    console.log(evt.target.result);
                    ok(evt.target.result === rule, "reader.result should be equal to the text written.");
                    QUnit.start();
                };
                reader.readAsText(filePath);
            };
        
        // create a file, write to it, and read it in again
        this.root.getFile(fileName, {create: true}, create_writer, this.fail);
    });
    module('FileWriter model', {
        // setup function will run before each test
        setup: function() {
            var that = this;
            this.root = getFileSystemRoot(LocalFileSystem.PERSISTENT); 
            this.fail = function(error) {
                console.log('file error: ' + error.code);
            };
            // creates the specified file, then invokes the specified callback
            this.createFile = function(fileName, callback) {
                // creates file
                var create_file = function() {
                    that.root.getFile(fileName, {create: true}, callback, that.fail);                
                };
                
                // deletes file, if it exists
                that.root.getFile(fileName, null, 
                        // remove file system entry
                        function(entry) {
                            entry.remove(create_file, that.fail); 
                        },
                        // doesn't exist, just invoke callback
                        create_file);
            };
        }
    });    
    test("FileWriter object should have correct methods", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(5);
        
        // retrieve a FileWriter object
        var fileName = "write.txt",
            test_writer = function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    ok(typeof writer !== 'undefined' && writer !== null, "FileEntry.createWriter should return a FileWriter object.");
                    ok(typeof writer.write === 'function', "FileWriter object should have a write function.");
                    ok(typeof writer.seek === 'function', "FileWriter object should have a seek function.");
                    ok(typeof writer.truncate === 'function', "FileWriter object should have a truncate function.");
                    ok(typeof writer.abort === 'function', "FileWriter object should have an abort function.");
                    QUnit.start();
                }, this.fail);
            };

        // test FileWriter
        this.root.getFile(fileName, {create: true}, test_writer, this.fail);                        
    });
    test("should be able to write and append to file", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(5);

        var that = this,
            // file name
            fileName = "append.txt",
            // path to file
            filePath = this.root.fullPath + '/' + fileName,
            // file content
            rule = "There is an exception to every rule.",
            // for testing file length
            length = rule.length,
            // writes initial file content
            write_file = function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        ok(navigator.fileMgr.testFileExists(filePath) === true, "file should exist");
                        ok(writer.length === length, "should have written " + length + " bytes");
                        ok(writer.position === length, "position should be at " + length);
                        append_file(writer);
                    };
                    writer.write(rule); 
                }, that.fail);
            }, 
            // appends to file
            append_file = function(writer) {
                var exception = "  Except this one.";            
                writer.onwriteend = function(evt) {
                    ok(writer.length === length, "file length should be " + length);
                    ok(writer.position === length, "position should be at " + length);
                    QUnit.start();
                };
                length += exception.length;
                writer.seek(writer.length);
                writer.write(exception); 
            };
        
        // create file, then write and append to it
        this.createFile(fileName, write_file);
    });
    test("should be able to write XML data", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(3);

        var that = this,
            // file name
            fileName = "append.txt",
            // path to file
            filePath = this.root.fullPath + '/' + fileName,
            // file content
            rule = '<?xml version="1.0" encoding="UTF-8"?>\n<test prop="ack">\nData\n</test>\n',
            // for testing file length
            length = rule.length,
            // writes file content
            write_file = function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        ok(navigator.fileMgr.testFileExists(filePath) === true, "file should exist");
                        ok(writer.length === length, "should have written " + length + " bytes");
                        ok(writer.position === length, "position should be at " + length);
                        QUnit.start();
                    };
                    writer.write(rule); 
                }, that.fail);
            };
            
        // creates file, then write XML data
        this.createFile(fileName, write_file);
    });
    test("should be able to write JSON data", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(3);

        var that = this,
            // file name
            fileName = "json.txt",
            // path to file
            filePath = this.root.fullPath + '/' + fileName,
            // file content
            rule = '{ "name": "Guy Incognito", "email": "here@there.com" }',
            // for testing file length
            length = rule.length,
            // writes file content
            write_file = function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        ok(navigator.fileMgr.testFileExists(filePath) === true, "file should exist");
                        ok(writer.length === length, "should have written " + length + " bytes");
                        ok(writer.position === length, "position should be at " + length);
                        QUnit.start();
                    };
                    writer.write(rule); 
                }, that.fail);
            };
        
        // creates file, then write JSON content
        this.createFile(fileName, write_file);
    });
    test("should be able to seek", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(5);
        
        var that = this,
            // file name
            fileName = "seek.txt",
            // file content
            rule = "There is an exception to every rule.  Except this one.",
            // for testing file length
            length = rule.length,
            // writes file content and tests writer.seek
            seek_file = function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        ok(writer.position == length, "position should be at " + length); 
                        writer.seek(-5);
                        ok(writer.position == (length-5), "position should be at " + (length-5)); 
                        writer.seek(100);
                        ok(writer.position == length, "position should be at " + length); 
                        writer.seek(10);
                        ok(writer.position == 10, "position should be at 10"); 
                        QUnit.start();
                    };
                    writer.seek(-100);
                    ok(writer.position == 0, "position should be at 0");        
                    writer.write(rule);
                }, that.fail);
            };
            
        // creates file, then write JSON content
        this.createFile(fileName, seek_file);
    });
    test("should be able to truncate", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(2);
        
        var that = this,
            // file name
            fileName = "truncate.txt",
            // file content
            rule = "There is an exception to every rule.  Except this one.",
            // writes file content 
            write_file = function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.onwriteend = function(evt) {
                        truncate_file(writer);
                    }; 
                    writer.write(rule);
                }, that.fail);
            },
            // and tests writer.truncate
            truncate_file = function(writer) {
                writer.onwriteend = function(evt) {
                    ok(writer.length == 36, "file length should be 36");
                    ok(writer.position == 36, "position should be at 36");  
                    QUnit.start();
                }; 
                writer.truncate(36);                
            };

        // creates file, writes to it, then truncates it
        this.createFile(fileName, write_file);
    });
};
