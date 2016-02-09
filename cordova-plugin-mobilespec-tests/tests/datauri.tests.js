/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

exports.defineAutoTests = function () {
    var isWindowsPhone = cordova.platformId == 'windowsphone';
    var isWindows = (cordova.platformId === "windows") || (cordova.platformId === "windows8");

    describe('data uris', function () {
        var frame;
        var onMessageBind;

        function onMessage(done, msg) {
            if (msg.data == 'foo') {
                expect('Suppress SPEC HAS NO EXPECTATIONS').toBeDefined();
                done();
            }
        }

        afterEach(function () {
            if (frame) {
                document.body.removeChild(frame);
                window.removeEventListener('message', onMessageBind, false);
            }
        });

        it("datauri.spec.1 should work with iframes", function (done) {
            // IE on WP7/8 considers 'data:' in frame.src string as protocol type
            // so asks user to look for appropriating application in the market;
            // temporary skipped since requires user interaction
            // data:text/html is not supported by IE so pended for windows platform for now
            if (isWindowsPhone || isWindows) {
                pending();
            }

            frame = document.createElement('iframe');
            onMessageBind = onMessage.bind(null, done);
            window.addEventListener('message', onMessageBind, false);
            frame.src = 'data:text/html;charset=utf-8,%3Chtml%3E%3Cscript%3Eparent.postMessage%28%27foo%27%2C%27%2A%27%29%3C%2Fscript%3E%3C%2Fhtml%3E';
            document.body.appendChild(frame);
        }, 1000);
    });

    describe('data uris', function () {
        var errorHandler = {
            onError: function (done) {
                if (typeof (done) === "function") {
                    done();
                }
            }
        };

        beforeEach(function () {
            spyOn(errorHandler, 'onError').and.callThrough();
        });

        afterEach(function () {
            expect(errorHandler.onError).not.toHaveBeenCalled();
        });

        it("datauri.spec.2 should work with images Jasmine 2", function (done) {
            var img = new Image();
            img.onload = done;
            img.onerror = errorHandler.onError.bind(null, done);

            img.src = 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7';
        });
    });
}
