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

exports.defineManualTests = function (contentEl, createActionButton) {
    var html = '<h1>Tests for third-party plugins</h1>\n';
    var pluginInfos = [];
    if (/android/.exec(cordova.platformId)) {
        pluginInfos.push({ id: 'org.devgeeks.privacyscreen', remarks: ['Use the task switcher and make sure app screenshot disappears']});
    }
    function logSuccess(msg) {
        console.log('Success. result=' + msg);
    }
    function logFailure(msg) {
        console.warn('Failed. result=' + msg);
    }
    createActionButton('AppVersion', function() {
        cordova.getAppVersion(logSuccess);
    });
    // https://github.com/Telerik-Verified-Plugins/NFC
    createActionButton('Share via NFC', function() {
        var records = [
            ndef.textRecord("Hi there at " + new Date()),
            ndef.uriRecord("http://plugins.telerik.com/plugin/nfc"),
            ndef.mimeMediaRecord("text/blah", nfc.stringToBytes("Blah!"))
        ];
        nfc.share(records, logSuccess, logFailure);
    });
    // https://github.com/Telerik-Verified-Plugins/Keyboard
    createActionButton('Show Keyboard', function() {
        cordova.plugins.Keyboard.show();
    });
    window.addEventListener('native.keyboardshow', function (e) {
        console.log('Keyboard opened, height is ' + e.keyboardHeight + 'px');
    });
    window.addEventListener('native.keyboardhide', function (e) {
        console.log('Keyboard closed');
    });
    // https://github.com/Telerik-Verified-Plugins/Keychain
    if (/ios/.exec(cordova.platformId)) {
        // prepare some variables
        var servicename = 'SomeServiceName';
        var key = 'SomeKey';
        var value = 'SomeValue';
        var kc = new Keychain();
        // store your password in the Keychain
        createActionButton('Write keychain value', function() {
            kc.setForKey(logSuccess, logFailure, key, servicename, value + '-' + +new Date());
        });
        createActionButton('Read keychain value', function() {
            kc.getForKey(logSuccess, logFailure, key, servicename);
        });
    }
    // https://github.com/Telerik-Verified-Plugins/BarcodeScanner
    createActionButton('Scan Barcode', function() {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log('We got a barcode\n' +
                          'Result: ' + result.text + '\n' +
                          'Format: ' + result.format + '\n' +
                          'Cancelled: ' + result.cancelled);
            }, logFailure, {
                'preferFrontCamera' : false,
                'showFlipCameraButton' : true
            });
    });
    // https://github.com/Telerik-Verified-Plugins/Toast
    createActionButton('Show Toast', function() {
        window.plugins.toast.show('Hello there!', 'long', 'center', logSuccess, logFailure);
    });
    // https://github.com/Telerik-Verified-Plugins/NativePageTransitions
    createActionButton('Flip', function() {
        window.plugins.nativepagetransitions.flip({}, logSuccess, logFailure);
        setTimeout(function() {
            console.log('This log should appear only after animation.');
        }, 10);
    });
    // https://github.com/Telerik-Verified-Plugins/EmailComposer
    createActionButton('Email Compose', function() {
        window.plugin.email.isServiceAvailable(function(result) {
            console.log('Service available: ' + result);
            if (result) {
                window.plugin.email.open({
                   to:          ['person1@domain.com'],
                   subject:     'EmailComposer plugin test',
                   body:        '<h2>Hello!</h2>This is <strong>HTML</strong> email.',
                   isHtml:      true
                }, logSuccess);
            }
        });
    });
    // https://github.com/Telerik-Verified-Plugins/Calendar
    if (/ios|android/.exec(cordova.platformId)) {
        createActionButton('Open Calendar', function() {
            var d = new Date(new Date().getTime() + 3*24*60*60*1000);
            window.plugins.calendar.openCalendar(d, logSuccess, logFailure);
        });
        createActionButton('Create event', function() {
            window.plugins.calendar.createEventInteractively('Test Event', 'my house', 'description, yeah', +new Date, +new Date, logSuccess, logFailure);
        });
    }
    // https://github.com/Telerik-Verified-Plugins/SocialSharing
    createActionButton('Social Share a URL', function() {
        window.plugins.socialsharing.share('Some message to share', 'The Subject', 'https://cordova.apache.org/', logSuccess, logFailure);
    });
    // https://github.com/brodysoft/Cordova-SQLitePlugin
    createActionButton('SQLLitePlugin - test', function() {
        var db = window.sqlitePlugin.openDatabase({name: "my.db"});
        db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS test_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

            // demonstrate PRAGMA:
            db.executeSql("pragma table_info (test_table);", [], function(res) {
                console.log("PRAGMA res: " + JSON.stringify(res));
            });
        }, logFailure);
    });
    // https://github.com/Telerik-Verified-Plugins/Flashlight
    createActionButton('Flashlight (3 seconds)', function() {
        window.plugins.flashlight.available(function(isAvailable) {
            console.log('isAvailable=' + isAvailable);
            if (isAvailable) {
                window.plugins.flashlight.switchOn(logSuccess, logFailure);
                setTimeout(function() {
                    window.plugins.flashlight.switchOff(logSuccess, logFailure);
                }, 3000);
            }
        });
    });
    // https://github.com/Wizcorp/phonegap-facebook-plugin
    createActionButton('Facebook plugin', function() {
        facebookConnectPlugin.login(['public_profile'], function (userData) {
            console.log('UserInfo: ' + JSON.stringify(userData));
        }, logFailure);
    });
    // https://github.com/yoik/cordova-yoik-screenorientation
    createActionButton('lock to landscape', function() {
        screen.lockOrientation('landscape');
        console.log('Orientation is ' + screen.orientation);
    });
    createActionButton('unlock orientation', function() {
        screen.unlockOrientation();
        console.log('Orientation is ' + screen.orientation);
    });
    // https://github.com/cranberrygame/com.cranberrygame.phonegap.plugin.ad.admob.overlay
    function initAds(then) {
        var adUnit = 'ca-app-pub-4355727382565272/8389156346';
        var adUnitFullScreen = 'ca-app-pub-4355727382565272/9307486345';
        if (!window.isAdSetup) {
            window.admob.setUp(adUnit, adUnitFullScreen, /* overlap */ false, /* isTest */ true);
            window.admob.onFullScreenAdLoaded = function() {
                console.log('onFullScreenAdLoaded');
            };
            window.admob.onFullScreenAdShown = function() {
                console.log('onFullScreenAdShown');
            };
            window.admob.onFullScreenAdClosed = function() {
                console.log('onFullScreenAdClosed');
            };
            window.isAdSetup = true;
            setTimeout(then, 100);
        } else {
            then()
        };
    }
    createActionButton('Show banner ad', function() {
        initAds(function() {
            window.admob.showBannerAd('bottom-center', 'SMART_BANNER');
        });
    });
    createActionButton('Hide banner ad', function() {
        window.admob.hideBannerAd();
    });
    createActionButton('Show fullscreen ad', function() {
        initAds(function() {
            window.admob.showFullScreenAd();
        });
    });
    // https://github.com/katzer/cordova-plugin-local-notifications/
    createActionButton('Show local notification', function() {
        if (window.plugin.notification.local.registerPermission) {
            window.plugin.notification.local.registerPermission(go);
        } else {
            go(true);
        }
        function go(granted) {
            console.log('Permission has been granted: ' + granted);
            if (granted) {
                window.plugin.notification.local.ontrigger = function (id, state, json) {
                    console.log('notification ' + id + ' triggered.');
                };
                window.plugin.notification.local.onclick = function (id, state, json) {
                    console.log('notification ' + id + ' clicked.');
                };
                window.plugin.notification.local.oncancel = function (id, state, json) {
                    console.log('notification ' + id + ' canceled.');
                };
                window.plugin.notification.local.add({ message: 'Great app!', led: 'A0FF05' });
            }
        }
    });

    var mapInit;
    function getMap() {
        if (!mapInit) {
            mapInit = plugin.google.maps.Map.getMap();
            mapInit.on(plugin.google.maps.event.MAP_READY, function() {
                console.log('Map is ready.');
            });
            mapInit.on(plugin.google.maps.event.MAP_CLICK, function(latLng) {
                console.log('Map was clicked at position: ' + latLng.toUrlValue());
            });
            mapInit.setBackgroundColor('red');
        }
        return mapInit;
    }
    // https://github.com/wf9a5m75/phonegap-googlemaps-plugin
    var mapDiv;
    createActionButton('Show Map', function() {
        var map = getMap();
        if (!mapDiv) {
            mapDiv = contentEl.ownerDocument.createElement('div');
            mapDiv.style.cssText = 'width:400px;height:300px;border:2px solid black';
            contentEl.appendChild(mapDiv);
            map.setDiv(mapDiv);
        } else {
            map.refreshLayout();
        }
    });
    var mapDebuggable = false;
    createActionButton('toggle Map Debuggable', function() {
        var map = getMap();
        mapDebuggable = !mapDebuggable;
        map.setDebuggable(mapDebuggable);
    });
    createActionButton('Show Map Fullscreen', function() {
        var map = getMap();
        map.showDialog();
    });

    for (var i = 0; i < pluginInfos.length; ++i) {
        var pluginInfo = pluginInfos[i];
        html += pluginInfo.id;
        if (pluginInfo.remarks) {
            html += '<ul><li>' + pluginInfo.remarks.join('</li><li>') + '</ul>';
        }
    }
    contentEl.innerHTML = html;
};
