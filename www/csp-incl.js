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

var PLAT;
(function getPlatform() {
    var platforms = {
        android: /Android/,
        ios: /(iPad)|(iPhone)|(iPod)/
    };
    for (var key in platforms) {
        if (platforms[key].exec(navigator.userAgent)) {
            PLAT = key;
            break;
        }
    }
})();

// To disable CSP, define _disableCSP and set to true, prior to the inclusion
// of this file.
if (!window._disableCSP) {
    var cspMetaContent = null;
    switch (PLAT) {
        case 'android':
        case 'ios':
            cspMetaContent = 'default-src \'self\' https://ssl.gstatic.com/accessibility/javascript/android/;' +
                            ' connect-src \'self\' http://www.google.com;' +
                            ' media-src \'self\' http://cordova.apache.org/downloads/ https://cordova.apache.org/downloads/;' +
                            ' frame-src \'self\' http://stealbridgesecret.test/ data: gap:;' +
                            ' img-src \'self\' data: cdvfile:;' +
                            ' style-src \'self\' \'unsafe-inline\'';
            break;
    }

    if (cspMetaContent) {
        cspMetaContent = '<meta http-equiv="Content-Security-Policy" content="' + cspMetaContent + '"/>';
        document.write(cspMetaContent);
    }
}
else {
    console.log('CSP injection is disabled.');
}

