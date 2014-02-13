#!/bin/bash

# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.


# Script creates a mobilespec project that uses all local repositories.
# It currently installs only the iOS and Android platforms.
# Based on: https://wiki.apache.org/cordova/WorkingWithThree#preview

# TODO: Remove once CLI/plugman moves away from shelljs.exec().
ulimit -S -n 4096

if [[ ! -d cordova-mobile-spec ]]; then
  echo "Please run this script from the directory that contains cordova-mobile-spec"
  exit 1
fi

if [[ -e mobilespec ]]; then
  echo "Directory \"mobilespec\" already exists. Delete it first then re-run."
  exit 1
fi

echo "Creating mobilespec project. If you have any errors, it may be from missing repositories."
echo "To clone needed repositories:"
echo "  ./cordova-coho/coho repo-clone -r plugins -r mobile-spec -r android -r ios -r cli"
echo "To update all repositories:"
echo "  ./cordova-coho/coho repo-update -r auto"
REPO_PARENT="$PWD"
set -e

./cordova-cli/bin/cordova create mobilespec --link-to cordova-mobile-spec
( cd cordova-js; grunt ) || exit $?
cd mobilespec
echo '{
  "id":"org.apache.mobilespec",
  "name":"mobilespec",
  "lib": {
    "android": {
      "uri": "'"$REPO_PARENT/cordova-android"'"
    },
    "ios": {
      "uri": "'"$REPO_PARENT/cordova-ios"'"
    }
  }
}' > .cordova/config.json

set -x
../cordova-cli/bin/cordova platform add ios android
../cordova-cli/bin/cordova plugin add ../cordova-mobile-spec/dependencies-plugin --searchpath "$REPO_PARENT"
rm -rf platforms/ios/CordovaLib
../cordova-ios/bin/update_cordova_subproject platforms/ios/mobilespec.xcodeproj
cp ../cordova-js/pkg/cordova.android.js platforms/android/platform_www/cordova.js
cp ../cordova-js/pkg/cordova.ios.js platforms/ios/platform_www/cordova.js
../cordova-cli/bin/cordova prepare
ln -s ../cordova-cli/bin/cordova cordova

set +x
echo "App created in the mobilespec/ directory."
echo "Symlink to CLI created as mobilespec/cordova"



