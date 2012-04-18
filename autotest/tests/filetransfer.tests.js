Tests.prototype.FileTransferTests = function() {  
    module('FileTransfer');
    test("should exist", function() {
        expect(1);
        var ft = new FileTransfer();
        ok(ft !== null, "FileTransfer should not be null.");
    });
    test("should contain proper function", function() {
        expect(4);
        var ft = new FileTransfer();
        ok(typeof ft.upload != 'undefined' && ft.upload !== null, "FileTransfer.upload should not be null.");
        ok(typeof ft.upload == 'function', "FileTransfer.upload should be a function.");
        ok(typeof ft.download != 'undefined' && ft.download !== null, "FileTransfer.download should not be null.");
        ok(typeof ft.download == 'function', "FileTransfer.download should be a function.");
    });
    module('FileTransferError interface');
    test("FileTransferError constants should be defined", function() {
        expect(3);
        equal(FileTransferError.FILE_NOT_FOUND_ERR, 1, "FileTransferError.FILE_NOT_FOUND_ERR should be defined");
        equal(FileTransferError.INVALID_URL_ERR, 2, "FileTransferError.INVALID_URL_ERR should be defined");
        equal(FileTransferError.CONNECTION_ERR, 3, "FileTransferError.CONNECTION_ERR should be defined");
    });
    module('FileTransfer.download');
    test("should be able to download a file", function() {
        expect(1);
        QUnit.stop(Tests.TEST_TIMEOUT);
        var fail = function(error) {
            ok(false, "This test failed, check to see if you whitelisted 'ajax.googleapis.com'");
            QUnit.start();
        };
        var remoteFile = "https://ajax.googleapis.com/ajax/libs/dojo/1.7.2/dojo/dojo.js";
        var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                var ft = new FileTransfer();
                ft.download(remoteFile, fileEntry.fullPath, function(entry) {
                    ok(entry.name == localFileName, "File name returned should match expected");
                    QUnit.start();
                    }, fail);
            }, fail);
        }, fail);
    });
};
