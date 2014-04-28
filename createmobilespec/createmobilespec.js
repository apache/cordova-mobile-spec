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
     
var fs            = require("fs"),
    path          = require("path"),
    child_process = require("child_process"),
    shelljs,
    optimist;

// Dependencies requirements check
try {
    shelljs = require("shelljs");
    optimist = require("optimist");
} catch (e) {
    console.error('Missing module. Please run \"npm install\" from this directory:\n\t' +
                   path.dirname(__dirname));
    process.exit(2);
}
// Print relevant information
console.log("Creating \"mobilespec\" project. If you have any errors, it may be from missing repositories.");
console.log("To clone needed repositories:");
console.log("  ./cordova-coho/coho repo-clone -r plugins -r mobile-spec -r android -r ios -r cli");
console.log("To update all repositories:");
console.log("  ./cordova-coho/coho repo-update");

// Setting up vars, folders and libraries, to ensure full compatibility cross platform, absolute paths are used instead of relative paths
// Cordova Coho dir, it should contain all libraries and required repositories
// [cordova-cli, cordova-android, cordova-blackberry, cordova-ios, cordova-windows, cordova-windows8, all plugins libraries, cordova-mobile-spec, cordova-js]
// searchDir function it was added, to look for cordova-coho folder backwards, for cases like absolute/path/cordova-coho/cordova-coho/...All libraries
// This is to make sure that cordova-coho exists and it's the right one.
shelljs.pushd("../../../cordova-coho");
var coho_dir       = process.cwd()+path.sep,
    cordova_cli    = path.join(coho_dir, "cordova-cli", "bin", "cordova"),
    cordova_ms     = path.join(coho_dir, "cordova-mobile-spec"),
    cordova_js     = path.join(coho_dir, "cordova-js"),
    platforms      = [],
    //Setting up optimist features
    tokens         = process.argv.slice(2),
    argv = optimist.usage('\n\nMain usage: \n\n$0 [--android] [--blackberry10] [--ios] [--windows8] [--wp8]')
                    .describe('help', 'Shows usage')
                    .describe('platformId', 'Add supported platforms to mobilespec project (Android, Blackberry10, iOS, Windows 8, Windows Phone 8)')
                    .alias('h', 'help')
                    .argv;
shelljs.pushd("../");
var ms_project_dir = path.join(process.cwd(),"mobilespec");

// Main libraries and path"s requirements check
if (!fs.existsSync(coho_dir)) {
    console.log("Please run this script from the directory that contains cordova-coho");
    shelljs.exit(1);
}

if (!fs.existsSync(cordova_ms)) {
    console.log("Please run this script from the directory that contains cordova-mobile-spec");
    shelljs.exit(1);
}

if (!fs.existsSync(cordova_js)) {
    console.log("Please run this script from the directory that contains cordova-js");
    shelljs.exit(1);
}

// No arguments show help
if (tokens.length === 0) {
    console.log("\n\nNo Arguments were found");
    optimist.showHelp();
    process.exit(2);
}

if (argv.help) {optimist.showHelp(); return;}
if (argv.android) { platforms.push("android");}
if (argv.ios) { platforms.push("ios");}
if (argv.blackberry10) { platforms.push("blackberry10");}
if (argv.wp8) { platforms.push("wp8");}
if (argv.windows8) { platforms.push("windows8");}

// No platforms show help
if (platforms.length === 0){
    console.log("\n\nNo platforms were selected. Please choose at least one of the supported platforms.");
    optimist.showHelp();
    process.exit(2);
}

// Custom function to delete project folder, using recursive actions
try {
    shelljs.rm('-rf', ms_project_dir);
} catch (e) {
    //The project directory after an android build and emulation is locked by ADB.exe (Android Debug Bridge).
    //Kill the process & restart folder deletion
    console.log("Not all files were deleted, killing Adb.exe process to unlock project folder ...");
    if (/^win/.test(process.platform)) {
        shelljs.exec("TASKKILL /F /IM ADB.exe /T");
        shelljs.rm('-r', ms_project_dir);
        }else
            throw new Error("Error during folder deletion, try to remove mobilespec project folder manually");
    }

// Setting up config.fatal as true, if something goes wrong the program it will terminate
shelljs.config.fatal = true;
// Creating the project, linked to cordova-mobile-spec library
shelljs.exec(cordova_cli + " create mobilespec org.apache.cordova.mobilespec MobileSpec_Tests --link-to cordova-coho/cordova-mobile-spec");

// Executing grunt task, to generate updated js files for each platform
shelljs.pushd(cordova_js);
shelljs.exec("grunt");

// Config.json file ---> linked to local libraries
shelljs.pushd(ms_project_dir);

var localPlatforms = {
    "id" : "org.apache.cordova",
    "name" : "mobilespec",
    "lib" : {
        "android" : {
            "uri" : coho_dir + "cordova-android"
        },
        "ios" : {
            "uri" : coho_dir + "cordova-ios"
        },
        "blackberry10" : {
            "uri" : coho_dir + "cordova-blackberry"
        },
        "wp8" : {
            "uri" : coho_dir + "cordova-wp8"
        },
        "windows8" : {
            "uri" : coho_dir + "cordova-windows"
        }
    }
};
JSON.stringify(localPlatforms).to(".cordova/config.json");

//Executing platform Add
console.log("Adding platforms...");
platforms.forEach(function (platform) {
    console.log("Adding Platform: " + platform);
    shelljs.exec(cordova_cli + " platform add " + platform + " --verbose");
});

// Installing plugins, using local library and dependencies file.
console.log("Adding plugins...");
shelljs.exec(cordova_cli +" plugin add " + path.join(cordova_ms, "dependencies-plugin") + " --searchpath " + coho_dir);

// Updating Js files for each added platform
console.log("Updating js for platforms...");
platforms.forEach(function (platform) {
    shelljs.cp("-f", path.join(cordova_js, "pkg", "cordova." + (function () {
                return platform === "wp8" ? "windowsphone" : platform;
            }
                ()) + ".js"), path.join(ms_project_dir, "platforms", platform, "platform_www", "cordova.js"));
    console.log("Javascript file updated for " + platform);
});

// Executing cordova prepare
console.log("Preparing project...");
shelljs.exec(cordova_cli + " prepare");
console.log("Linking CLI...");

// Writing link files to use Local CLI
if (/^win/.test(process.platform)) {
    var winBatchFile = "node  " + cordova_cli + " %*";
    fs.writeFileSync(path.join(ms_project_dir, "cordova.bat"), winBatchFile);
} else {
    fs.symlinkSync(cordova_cli, "cordova");
}

console.log("\"mobilespec\" project created at:\n" + ms_project_dir);
console.log("Symlink to CLI created as mobilespec/cordova");
