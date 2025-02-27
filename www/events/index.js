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

var deviceReady = false;

function logEvent(e) {
  eventOutput("Got Event: " + e.type);
}

var eventOutput = function(s) {
    var el = document.getElementById("results");
    el.innerHTML = el.innerHTML + s + "<br>";
};

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            console.log("Device="+device.platform+" "+device.version);
            eventOutput("deviceready event: "+device.platform+" "+device.version);
        }, false);
    window.setTimeout(function() {
      if (!deviceReady) {
        alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
      }
    },1000);
}


window.onload = function() {
  addListenerToClass('interceptBackButton', function() {
    document.addEventListener('backbutton', logEvent, false);
  });
  addListenerToClass('stopInterceptOfBackButton', function() {
    document.removeEventListener('backbutton', logEvent, false);
  });
  addListenerToClass('interceptMenuButton', function() {
    document.addEventListener('menubutton', logEvent, false);
  });
  addListenerToClass('stopInterceptOfMenuButton', function() {
    document.removeEventListener('menubutton', logEvent, false);
  });
  addListenerToClass('interceptSearchButton', function() {
    document.addEventListener('searchbutton', logEvent, false);
  });
  addListenerToClass('stopInterceptOfSearchButton', function() {
    document.removeEventListener('searchbutton', logEvent, false);
  });
  addListenerToClass('interceptVolumeUpButton', function() {
    document.addEventListener('volumeupbutton', logEvent, false);
  });
  addListenerToClass('stopInterceptOfVolumeUpButton', function() {
    document.removeEventListener('volumeupbutton', logEvent, false);
  });
  addListenerToClass('interceptVolumeDownButton', function() {
    document.addEventListener('volumedownbutton', logEvent, false);
  });
  addListenerToClass('stopInterceptOfVolumeDownButton', function() {
    document.removeEventListener('volumedownbutton', logEvent, false);
  });
  addListenerToClass('interceptResume', function() {
    document.addEventListener('resume', logEvent, false);
  });
  addListenerToClass('stopInterceptOfResume', function() {
    document.removeEventListener('resume', logEvent, false);
  });
  addListenerToClass('interceptPause', function() {
    document.addEventListener('pause', logEvent, false);
  });
  addListenerToClass('stopInterceptOfPause', function() {
    document.removeEventListener('pause', logEvent, false);
  });
  addListenerToClass('interceptOnline', function() {
    document.addEventListener('online', logEvent, false);
  });
  addListenerToClass('stopInterceptOfOnline', function() {
    document.removeEventListener('online', logEvent, false);
  });
  addListenerToClass('interceptOffline', function() {
    document.addEventListener('offline', logEvent, false);
  });
  addListenerToClass('stopInterceptOfOffline', function() {
    document.removeEventListener('offline', logEvent, false);
  });

  addListenerToClass('backBtn', backHome);
  init();
}
