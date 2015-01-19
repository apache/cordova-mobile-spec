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


exports.defineManualTests = function (contentEl, createActionButton) {
    contentEl.innerHTML = '<h1>Tests for &lt;input type="file"&gt;</h1>' +
        'regular: <input type="file"><br>' +
        'multiple: <input type="file"><br>' +
        'photos only: <input type="file"><br>' +
        'video only: <input type="file"><br>' +
        'audio only: <input type="file"><br>' +
        'multiple photos: <input type="file"><br>' +
        '.txt only: <input type="file"><br>' +
        '<img style="max-width:400px; max-height:200px; border:1px solid black">';
    function logOnChange(e) {
        var el = e.target;
        console.log('Got result for input "' + el.value + '": ' + JSON.stringify(el.files));
        var firstFile = el.files && el.files[0];
        if (firstFile && firstFile.type.match('image.*')) {
            contentEl.querySelector('img').src = URL.createObjectURL(firstFile);
        } else {
            contentEl.querySelector('img').src = 'about:blank';
        }
    }
    var els = contentEl.querySelectorAll('input');
    for (var i = 0; i < els.length; ++i) {
        els[i].onchange = logOnChange;
    }
};
