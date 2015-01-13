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

describe('Bridge', function() {

    // Adding this spec is the way to show some useful information to user
    // and to avoid failure of test framework (see CB-7491)
    it("bridge spec will run on android only", function() {
        expect(cordova.platformId).toBe('android');
    });

    if (cordova.platformId == 'android') {
        it("bridge.spec.1 should reject bridge from iframe with data: URL", function() {
            var ifr = document.createElement('iframe');
            var done = false;
            ifr.src = 'data:text/html,';
            ifr.onload = function() {
                var stolenSecret = ifr.contentWindow.prompt('', 'gap_init:');
                done = true;
                expect(!!stolenSecret).toBe(false);
            };
            document.body.appendChild(ifr);
            waitsFor(function() { return done; });
        });
    }
});
