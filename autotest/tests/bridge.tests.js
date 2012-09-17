/*
 *
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
 *
*/

/* This test requires some extra code to run, because we want benchmark results */

/*
 It's never going to be OVER 9000
 http://youtu.be/SiMHTK15Pik 
*/
var FENCEPOST = 9000;

var exec = cordova.require('cordova/exec');

var echo = cordova.require('cordova/plugin/echo'),
            startTime = +new Date,
            callCount = 0,
            durationMs = 1000,
            asyncEcho = true,
            useSetTimeout = true,
            payloadSize = 5,
            callsPerSecond = 0,
            completeSpy = null, 
            payload = new Array(payloadSize * 10 + 1).join('012\n\n 6789');

var vanillaWin = function(result) {
            callCount++;
            if (result != payload) {
                console.log('Wrong echo data!');
            }
            var elapsedMs = new Date - startTime;
            if (elapsedMs < durationMs) {
                if (useSetTimeout) {
                    setTimeout(echoMessage, 0);
                } else {
                    echoMessage();
                }
            } else {
               callsPerSecond = callCount * 1000 / elapsedMs;
               console.log('Calls per second: ' + callsPerSecond);
               if(completeSpy != null)
                completeSpy();
            }
        }

var reset = function()
{
            startTime = +new Date,
            callCount = 0,
            durationMs = 1000,
            asyncEcho = true,
            useSetTimeout = true,
            payloadSize = 5,
            callsPerSecond = 0,
            completeSpy = null,
            payload = new Array(payloadSize * 10 + 1).join('012\n\n 6789');
}

var echoMessage = function()
{
    echo(vanillaWin, fail, payload, asyncEcho);
}

var fail = jasmine.createSpy();

describe('The JS to Native Bridge', function() {

    //Run the reset
    beforeEach(function() {
        reset();
    });

    it('should work with prompt', function() {
        exec.setJsToNativeBridgeMode(0);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
    it("should work with jsObject", function() {
        exec.setJsToNativeBridgeMode(1);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
});

describe("The Native to JS Bridge", function() {

    //Run the reset
    beforeEach(function() {
        reset();
    });

    it("should work with polling", function() {
       exec.setNativeToJsBridgeMode(0);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
    it("should work with hanging get", function() {
        exec.setNativeToJsBridgeMode(1);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
    it("should work with load_url (not on emulator)", function() {
       exec.setNativeToJsBridgeMode(2);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
    it("should work with online event", function() {
        exec.setNativeToJsBridgeMode(3);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
    it("should work with the private api", function() {
        exec.setNativeToJsBridgeMode(4);
        var win = jasmine.createSpy().andCallFake(function(r) {
            vanillaWin(r);
        });
        completeSpy = jasmine.createSpy();
        runs(function() { 
            echo(win, fail, payload, asyncEcho);
        });
        waitsFor(function() { return completeSpy.wasCalled; }, "never completed", durationMs * 2);
        runs(function() { 
            expect(callsPerSecond).toBeGreaterThan(FENCEPOST);
        });
    });
});
