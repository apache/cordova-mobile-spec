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
    test("should read file properly", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(1);
        
        // file name and content
        var filePath = FILE_ROOT+"read.txt";
        var rule = "There is an exception to every rule.  Except this one.";    
        
        // delete old file
        try { 
            navigator.fileMgr.deleteFile(filePath);
        }
        catch (e) {
            // ok if not found
        }

        // 2nd - read the file 
        var read = function(evt) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("read success");
                console.log(evt.target.result);
                ok(evt.target.result === rule, "reader.result should be equal to the text written.");
                QUnit.start();
            };
            reader.readAsText(filePath);
        };
        
        // 1st - write the file to be read
        var writer = new FileWriter(filePath);
        writer.onwriteend = read; 
        writer.write(rule);
    });
    test("should contain a readAsArrayBuffer function", function() {
        expect(2);
        var reader = new FileReader();
        ok(typeof reader.readAsArrayBuffer != 'undefined' && reader.readAsArrayBuffer != null, "reader.readAsArrayBuffer should not be null.");
        ok(typeof reader.readAsArrayBuffer == 'function', "reader.readAsArrayBuffer should be a function.");
    });
    test("should contain an abort function", function() {
        expect(2);
        var reader = new FileReader();
        ok(typeof reader.abort != 'undefined' && reader.abort != null, "reader.abort should not be null.");
        ok(typeof reader.abort == 'function', "reader.abort should be a function.");
    });
    module('FileWriter model');    
    test("should be able to define a FileWriter object", function() {
        expect(1);
        var filePath=FILE_ROOT+"temp.txt";
        var writer = new FileWriter(filePath);
        ok(writer != null, "new FileWriter() should not be null.");
    });
    test("should contain a write function", function() {
        expect(2);
        var filePath=FILE_ROOT+"temp.txt";
        var writer = new FileWriter(filePath);
        ok(typeof writer.write != 'undefined' && writer.write != null, "writer.write should not be null.");
        ok(typeof writer.write == 'function', "writer.write should be a function.");
    });
    test("should be able to write and append to file", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(5);

        // file name and content
        var filePath = FILE_ROOT+"write.txt";
        var rule = "There is an exception to every rule.";
        var length = rule.length;

        // delete old file
        try { 
            navigator.fileMgr.deleteFile(filePath);
        }
        catch (e) {
            // ok if not found
        }
        
        // 3rd - append to file
        var append = function() {
            writer = new FileWriter(filePath, true);
            writer.onwriteend = function(evt) {
                ok(writer.length == length, "file length should be " + length);
                ok(writer.position == length, "position should be at " + length);
                QUnit.start();
            }
            var exception = "  Except this one.";
            length += exception.length;
            writer.write(exception); 
        };

        // 2nd - called when write completes
        var onwriteend = function(evt) {
            ok(navigator.fileMgr.testFileExists(filePath) == true, "file should exist");
            ok(writer.length == length, "should have written " + length + " bytes");
            ok(writer.position == length, "position should be at " + length);
            append();
        };
            
        // 1st - write to file
        var writer = new FileWriter(filePath);
        writer.onwriteend = onwriteend;
        writer.write(rule); 
    });
    test("should contain a seek function", function() {
        expect(2);
        var filePath=FILE_ROOT+"temp.txt";
        var writer = new FileWriter(filePath);
        ok(typeof writer.seek != 'undefined' && writer.seek != null, "writer.seek should not be null.");
        ok(typeof writer.seek == 'function', "writer.seek should be a function.");
    });
    test("should be able to seek", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(5);
        
        // file name and content
        var filePath = FILE_ROOT+"seek.txt";
        var rule = "There is an exception to every rule.  Except this one.";
        var length = rule.length;
        
        // delete old file
        try { 
            navigator.fileMgr.deleteFile(filePath);
        }
        catch (e) {
            // ok if not found
        }
        
        // 2nd - seek through file
        var seek = function(evt) {
            ok(writer.position == length, "position should be at " + length); 
            writer.seek(-5);
            ok(writer.position == (length-5), "position should be at " + (length-5)); 
            writer.seek(100);
            ok(writer.position == length, "position should be at " + length); 
            writer.seek(10);
            ok(writer.position == 10, "position should be at 10"); 
            QUnit.start();
        };

        // 1st - write to file
        var writer = new FileWriter(filePath);
        writer.seek(-100);
        ok(writer.position == 0, "position should be at 0");        
        writer.onwriteend = seek;
        writer.write(rule);
    });
    test("should contain a truncate function", function() {
        expect(2);
        var filePath=FILE_ROOT+"temp.txt";
        var writer = new FileWriter(filePath);
        ok(typeof writer.truncate != 'undefined' && writer.truncate != null, "writer.truncate should not be null.");
        ok(typeof writer.truncate == 'function', "writer.truncate should be a function.");
    });
    test("should be able to truncate", function() {
        QUnit.stop(tests.TEST_TIMEOUT);
        expect(2);
        
        // file name and content
        var filePath = FILE_ROOT+"truncate.txt";
        var rule = "There is an exception to every rule.  Except this one.";

        // delete old file
        try { 
            navigator.fileMgr.deleteFile(filePath);
        }
        catch (e) {
            // ok if not found
        }

        // 2nd - truncate the file
        var truncate = function() { 
            writer.onwriteend = function(evt) {
                ok(writer.length == 36, "file length should be 36");
                ok(writer.position == 36, "position should be at 36");  
                QUnit.start();
            }; 
            writer.truncate(36);
        };

        // 1st - write the file
        var writer = new FileWriter(filePath);
        writer.onwriteend = truncate;
        writer.write(rule);
    });
    test("should contain a abort function", function() {
        expect(2);
        var filePath=FILE_ROOT+"temp.txt";
        var writer = new FileWriter(filePath);
        ok(typeof writer.abort != 'undefined' && writer.abort != null, "writer.abort should not be null.");
        ok(typeof writer.abort == 'function', "writer.abort should be a function.");
    });    
};