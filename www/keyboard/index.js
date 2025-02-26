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
var keyboardPlugin = null;

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            keyboardPlugin = window.Keyboard; // for now, before plugin re-factor
                              
            if (keyboardPlugin == null) {
                var msg = 'The plugin org.apache.cordova.keyboard was not found. Check that you have it installed.';
                alert(msg);
            }

        }, false);
    window.setTimeout(function() {
      if (!deviceReady) {
            var msg = 'Error: Apache Cordova did not initialize.  Demo will not run correctly.';
            alert(msg);
      }
    },1000);
}

function setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(shrinkView, hideFormAccessoryBar, disableScrollingInShrinkView)
{
    keyboardPlugin.shrinkView(shrinkView);
    document.getElementById("shrinkView-arg").innerHTML = shrinkView;
    
    keyboardPlugin.hideFormAccessoryBar(hideFormAccessoryBar);
    document.getElementById("hideFormAccessoryBar-arg").innerHTML = hideFormAccessoryBar;

    keyboardPlugin.disableScrollingInShrinkView(disableScrollingInShrinkView);
    document.getElementById("disableScrollingInShrinkView-arg").innerHTML = disableScrollingInShrinkView;
}

window.onload = function() {
  addListenerToClass('keyboardIsVisible', function() {
    alert('Keyboard.isVisible: ' + Keyboard.isVisible);
  });
  addListenerToClass('set_1', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(false, false, false)
  });
  addListenerToClass('set_2', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(false, false, true)
  });
  addListenerToClass('set_3', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(false, true, true)
  });
  addListenerToClass('set_4', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(false, true, false)
  });
  addListenerToClass('set_5', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(true, false, false)
  });
  addListenerToClass('set_6', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(true, false, true)
  });
  addListenerToClass('set_7', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(true, true, true)
  });
  addListenerToClass('set_8', function() {
    setShrinkView_hideFormAccessoryBar_andDisableScrollingInShrinkView(true, true, false)
  });
  addListenerToClass('backBtn', backHome);
  init();
}
