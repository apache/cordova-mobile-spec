<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

# cordova-plugin-echo

This is a plugin implementation of the Echo function to test the bridge. It is currently used by Mobile Spec to test and benchmark the bridge.

## Echo

> The `echo` object provides an interface for testing the bridge. It
> sends any data received back across the bridge unmodifed. This 
> allows the bridge modes to be tested and benchmarked.

### Methods

- cordova.echo.echo
- cordova.echo.echoAsync
- cordova.echo.echoArrayBuffer
- cordova.echo.echoMultiPart

#### cordova.echo.echo

Echos string data in the same thread.

#### cordova.echo.echoAsync

Echos string data in a new UI thread.

#### cordova.echo.echoArrayBuffer

Echos base64 encoded data in the same thread.

#### cordova.echo.echoMultiPart

Echos a multipart message in the same thread.