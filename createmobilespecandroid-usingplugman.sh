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

if [[ ! -d cordova-mobile-spec ]]; then
  echo "Please run this script from the directory that contains cordova-mobile-spec"
  exit 1
fi

NAME=mobilespec-android

if [[ -e $NAME ]]; then
  echo "Directory \"$NAME\" already exists. Delete it first then re-run."
  exit 1
fi

echo "Creating $NAME project. If you have any errors, it may be from missing repositories."
echo "To clone needed repositories:"
echo "  ./cordova-coho/coho repo-clone -r plugins -r mobile-spec -r android -r ios -r plugman"
echo "To update all repositories:"
echo "  ./cordova-coho/coho repo-update"
REPO_PARENT="$PWD"
set -e

./cordova-android/bin/create $NAME org.apache.mobilespecplugman $NAME
( cd cordova-js; grunt ) || exit $?
cd $NAME

set -x
rm -r assets/www/*
cp -r ../cordova-mobile-spec/* assets/www
cp ../cordova-js/pkg/cordova.android.js assets/www/cordova.js
../cordova-plugman/main.js install --platform android --project . --plugin ../cordova-mobile-spec/dependencies-plugin --searchpath "$REPO_PARENT"

set +x
echo "App created in the $NAME/ directory."



