/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

console.log('Changing hash #1.');
if (location.search.indexOf('hash1') != -1) {
  location.hash = 'a';
} else if (location.search.indexOf('hash2') != -1) {
  location.replace('#replaced');
}
var hashCount = 0;
function changeHash() {
  hashCount += 1;
  if (hashCount % 1) {
    location.hash = hashCount;
  } else {
    location.replace('#' + hashCount);
  }
}
if (location.search.indexOf('changeURL') != -1) {
  history.replaceState(null, null, 'fakepage.html');
}
function loadFrame() {
  var ifr = document.createElement('iframe');
  ifr.src="data:text/html;base64,PGh0bWw+";
  document.body.appendChild(ifr);
}
function reload() {
  // Test that iOS CDVWebViewDelegate doesn't ignore changes when URL doesn't change.
  location.reload();
}
