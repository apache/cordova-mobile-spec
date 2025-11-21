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

var deviceReady = false;

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            console.log("Device="+device.platform+" "+device.version);
        }, false);
    window.setTimeout(function() {
        if (!deviceReady) {
            alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
        }
    },1000);
}

/* Battery */
function updateInfo(info) {
    document.getElementById('level').innerText = info.level;
    document.getElementById('isPlugged').innerText = info.isPlugged;
    if (info.level > 5) {
        document.getElementById('crit').innerText = "false";
    }
    if (info.level > 20) {
        document.getElementById('low').innerText = "false";
    }
}

function batteryLow(info) {
    document.getElementById('low').innerText = "true";
}

function batteryCritical(info) {
    document.getElementById('crit').innerText = "true";
}

function addBattery() {
    window.addEventListener("batterystatus", updateInfo, false);
}

function removeBattery() {
    window.removeEventListener("batterystatus", updateInfo, false);
}

function addLow() {
    window.addEventListener("batterylow", batteryLow, false);
}

function removeLow() {
    window.removeEventListener("batterylow", batteryLow, false);
}

function addCritical() {
    window.addEventListener("batterycritical", batteryCritical, false);
}

function removeCritical() {
    window.removeEventListener("batterycritical", batteryCritical, false);
}

window.onload = function() {
  addListenerToClass('addBattery', addBattery);
  addListenerToClass('removeBattery', removeBattery);
  addListenerToClass('addLow', addLow);
  addListenerToClass('removeLow', removeLow);
  addListenerToClass('addCritical', addCritical);
  addListenerToClass('removeCritical', removeCritical);
  
  addListenerToClass('backBtn', backHome);
  init();
}
