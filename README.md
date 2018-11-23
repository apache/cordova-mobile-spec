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
# Mobile Spec Suite

This repository contains a special Cordova project that provides a set of automated & manual tests that test Cordova core functionality.

To set up the project, use `cordova-mobile-spec/createmobilespec/createmobilespec.js`. See the [README.md](createmobilespec/README.md) in that directory.

## Requirements

Repositories required:

- **cordova-cli**  
  (Install pre-requisites by running `npm install` inside of cordova-cli).
- **cordova-js**
- All **plugins**.
- **Platforms** to test  
  (e.g., cordova-android, cordova-ios, cordova-blackberry,
  cordova-wp8, or cordova-windows).
- **cordova-mobile-spec**  
  (Install pre-requisites by running `npm install` inside of
  [createmobilespec](createmobilespec)).
- All repositories must be checked out as peers to each other.

## Running a Local File-Transfer Server

The `cordova-vm` file-transfer server could be offline for the `cordova-plugin-file-transfer` tests.

The server to run is at:
https://github.com/apache/cordova-labs/tree/cordova-filetransfer

And you would override this variable for this test plugin:
https://github.com/apache/cordova-plugin-file-transfer/blob/9b322dec6790f6d273b8f707bc07976d778c4cf6/tests/plugin.xml#L33
```
## in your mobilespec test project, run...
cordova plugin rm cordova-plugin-file-transfer-tests
cordova plugin add path/to/cordova-plugin-file-transfer/tests --variable FILETRANSFER_SERVER_ADDRESS="http://yourlocal-IPAddressHere:5000"
```

Run the server:
```
git clone https://github.com/apache/cordova-labs.git
cd cordova-labs
git checkout cordova-filetransfer
node server.js
```

Get your local ip by running:
```
ifconfig
```
