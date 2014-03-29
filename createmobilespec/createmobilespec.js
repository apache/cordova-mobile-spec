#!/usr/bin/env node

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

var fs = require('fs'),
    path = require('path'),
    shelljs,
    optimist;
try {
    shelljs = require('shelljs');
    optimist = require('optimist');
} catch (e) {
    console.error('Missing module. Please run "npm install" from this directory:\n\t' +
                   path.dirname(__dirname));
    process.exit(2);
}

var tokens = process.argv.slice(2);
var argv = optimist(tokens)
           .default('android', false)
           .default('ios', false)
           .usage('Usage: $0 [--android] [--ios]\nDefault is to use Android and iOS.')
           .argv;
// preserve the original behavior when there are no args
if (tokens.length === 0) {
    argv.android = true;
    argv.ios = true;
}
var platforms = [];
if (argv.android) { platforms.push('android'); }
if (argv.ios) { platforms.push('ios'); }

if (!fs.existsSync('cordova-mobile-spec')) {
    console.log('Please run this script from the directory that contains cordova-mobile-spec');
    shelljs.exit(1);
}

if (fs.existsSync('mobilespec')) {
    console.log('Directory "mobilespec" already exists. Delete it first then re-run.');
    shelljs.exit(1);
}

console.log('Creating mobilespec project. If you have any errors, it may be from missing repositories.');
console.log('To clone needed repositories:');
console.log("  ./cordova-coho/coho repo-clone -r plugins -r mobile-spec -r cli -r " + platforms.join(' -r '));
console.log('To update all repositories:');
console.log('  ./cordova-coho/coho repo-update');

var repoParent = process.cwd();
shelljs.config.fatal = true;

shelljs.exec('./cordova-cli/bin/cordova create mobilespec --link-to cordova-mobile-spec');

shelljs.pushd('cordova-js');
shelljs.exec('grunt');
shelljs.popd();

shelljs.pushd('mobilespec');
var localPlatforms = {
    "id": "org.apache.mobilespec",
    "name": "mobilespec",
    "lib": {
        "android": {
            "uri": repoParent + "/cordova-android"
        },
        "ios": {
            "uri": repoParent + "/cordova-ios"
        }
    }
};
JSON.stringify(localPlatforms).to('.cordova/config.json');

console.log('Adding platforms...');
shelljs.exec('../cordova-cli/bin/cordova platform add ' + platforms.join(' '));

console.log('Adding plugins...');
shelljs.exec('../cordova-cli/bin/cordova plugin add ../cordova-mobile-spec/dependencies-plugin --searchpath ' + repoParent);

if (argv.ios) {
    console.log('Updating iOS subproject...');
    shelljs.rm('-rf', 'platforms/ios/CordovaLib');
    shelljs.exec('../cordova-ios/bin/update_cordova_subproject platforms/ios/mobilespec.xcodeproj');
}

console.log('Updating js...');
if (argv.android) { shelljs.cp('-f', '../cordova-js/pkg/cordova.android.js', 'platforms/android/platform_www/cordova.js'); }
if (argv.ios) { shelljs.cp('-f', '../cordova-js/pkg/cordova.ios.js', 'platforms/ios/platform_www/cordova.js'); }

console.log('Preparing...');
shelljs.exec('../cordova-cli/bin/cordova prepare');

console.log('Linking CLI...');
fs.symlinkSync('../cordova-cli/bin/cordova', 'cordova');
shelljs.popd();

console.log('App created in the mobilespec/ directory.');
console.log('Symlink to CLI created as mobilespec/cordova');

