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
exports.defineAutoTests = function () {
    describe('Bridge', function (done) {
        it("bridge.spec.1 should reject bridge from iframe with data: URL", function (done) {
            if (cordova.platformId != 'android') {
                pending();
            }
            var ifr = document.createElement('iframe');

            ifr.src = 'data:text/html,';
            ifr.onload = function () {
                var stolenSecret = ifr.contentWindow.prompt('', 'gap_init:');
                expect(!!stolenSecret).toBe(false);
                done();
            };
            document.body.appendChild(ifr);
        });

    });
}
