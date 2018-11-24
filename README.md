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
# Cordova Mobile Spec Suite

This `cordova-mobile-spec` repository can be used to create a Cordova app that provides a set of automated & manual tests that test Cordova core functionality.

## Overview

This repository has 3 parts:

1. This main folder is a Cordova app "template" (`config.xml` and `www`) that includes implementations of various functionalities that Cordova supports (battery, events, keyboard, lazyloadjs, splashscreens, sql, storage, misc) that can manually be tested, some benchmarks, and a link to the automated and manual tests installed plugins offer (`cdvtests/index.html`).

2. There are 4 plugins as well: `cordova-plugin-echo`, `cordova-plugin-mobilespec-tests`, `cordova-plugin-thirdparty-tests` and `cordova-plugin-whitelist`.

3. The `createmobilespec` folder includes a script/CLI to create a Cordova app

    1. using the locally installed Cordova CLI, the currently up to date (published on npm) platforms and plugins (including their tests!), and the 4 local plugins from 2) (mode `--global`) or
    2. using local checkouts (via `cordova-coho`) of all these (CLI, tools, platforms, plugins...) or  
    3. with several other modes (to e.g. use plugman and /bin/create instead of the CLI)

The end result is a folder `../mobilespec` with a Cordova app that can be installed on devices. It can be used for some manual testing with the functionality offered by 1) or run the tests additionally provided by the plugins.

## Usage

See the [`README.md` in `/createmobilespec`](createmobilespec/README.md) for usage instruction on how to create the project.

### Cordova Plugin File-Transfer Tests

Tests of Cordova Plugin File-Transfer require a test server. [Follow these instructions to install and run the server and configure the plugin.](https://github.com/apache/cordova-labs/tree/cordova-filetransfer)