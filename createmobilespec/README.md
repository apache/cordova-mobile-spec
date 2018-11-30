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

# Creating the mobile-spec app

`createmobilespec.js` is a script for creating a test app that has:

* local `cordova-mobile-spec`
* a `cordova.js` file that is freshly built from the local `cordova-js` folder
* the platform (e.g. Android) from the local platform folder (e.g. `cordova-android`)
* all the plugins from the local plugin folders (e.g. `cordova-plugin-device`)
* it was built using the local `cordova-cli` and `cordova-plugman` folders

In other words, it is a great way to test your local development efforts.

The script also has options for creating the test app using a
globally-installed npm module, a way to use the platform's `cordova.js` file
instead of building it from the local `cordova-js` git repo,
and a way to use the platform-centered workflow instead of the CLI.

## Requirements and Preparation

1. Your Cordova projects have to be checked out and set up in a very specific way: All checkouts have to be siblings (= same parent folder) and the common Cordova libraries have to be npm-linked.  

    The easiest and quickest way to achieve this is by using `cordova-coho`:

    ```shell
    # Create a new folder, e.g. `cordova` and `cd cordova` into it.
    git clone https://github.com/apache/cordova-coho.git
    cd cordova-coho & npm install & cd ..
    node cordova-coho/coho repo-clone -r mobile-spec -r tools -r plugins -r active-platforms
    node cordova-coho/coho npm-link
    ```

    After this you should have 30+ folders in your `cordova` folder.

2. As `cordova-mobile-spec` has a special structure, you have to install dependencies in `createmobilespec` manually:
    ```shell
    cd cordova-mobile-spec/createmobilespec & npm install & cd ../..
    ```
3. You are now ready to use `createmobilespec.js` with the commands below.

## Usage

The `createmobilespec.js` script also needs to be invoked from the "main" folder you created before (`cordova`):

    cordova-mobile-spec/createmobilespec/createmobilespec.js

On Windows, prefix all commands with `node`:

    node cordova-mobile-spec/createmobilespec/createmobilespec.js

To see the options available in the script, run it with the `-h` option to print the online help.

    (node) cordova-mobile-spec/createmobilespec/createmobilespec.js -h

If anything is going wrong and the existing output does not help, add the `--debug` parameter:

    (node) cordova-mobile-spec/createmobilespec/createmobilespec.js --debug

### Create the App

Caution: If the generated `mobilespec` project already exists, it is recommended
to delete the project before proceeding.

To for example create the app for the Android platform, run:

    (node) cordova-mobile-spec/createmobilespec/createmobilespec.js --android

### Run the App

After the script successfully finished and created the app, you can run the app on a device or simulator, using the standard method for that platform(s). For example on **Android**:

    cd mobilespec
    ./cordova run android

## Potential Quirks and Issues

Some known quirks and issues:

* [`npm install` inside `cordova-js` is needed to resolve a local grunt issue](https://github.com/apache/cordova-mobile-spec/issues/150)
