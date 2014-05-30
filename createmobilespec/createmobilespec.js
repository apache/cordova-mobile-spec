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

'use strict';
     
var fs            = require("fs"),
    path          = require("path"),
    shelljs,
    optimist;

// Check that we can load dependencies
try {
    shelljs = require("shelljs");
    optimist = require("optimist");
} catch (e) {
    console.error('Missing module. Please run "npm install" from this directory:\n\t' +
                   path.dirname(__dirname));
    process.exit(2);
}

// Vars, folders and libraries. To ensure compatibility cross platform, absolute paths are used instead of relative paths.
var top_dir =             process.cwd() + path.sep,
    cli_local_bin =       path.join(top_dir, "cordova-cli", "bin", "cordova"),
    mobile_spec_git_dir = path.join(top_dir, "cordova-mobile-spec"),
    cordova_js_git_dir =  path.join(top_dir, "cordova-js"),
    cli_project_dir =     path.join(top_dir, "mobilespec"),
    platforms =           [],
    // where to find the /bin/create command and www dir in a non-CLI project
    platform_layout =     { "android":      { "bin": "cordova-android", 
                                              "www": "assets" + path.sep + "www" },
                            "blackberry10": { "bin": "cordova-blackberry" + path.sep + "blackberry10",
                                              "www": "www" },
                            "ios":          { "bin": "cordova-ios",
                                              "www": "www" },
                            "windows8":     { "bin": "cordova-windows" + path.sep + "windows8",
                                              "www": "www" },
                            "wp8":          { "bin": "cordova-wp8" + path.sep + "wp8",
                                              "www": "www" } },
    platform_dirs =       {"android": "cordova-android",
                           "blackberry10": "cordova-blackberry" + path.sep + "blackberry10",
                           "ios": "cordova-ios",
                           "windows8": "cordova-windows" + path.sep + "windows8",
                           "wp8": "cordova-wp8" + path.sep + "wp8"},
    // where to put the cordova.js file in a non-CLI project
    platform_www_dirs =   {"android": "assets" + path.sep + "www",
                          "blackberry10": "www",
                          "ios": "www",
                          "windows8": "www",
                          "wp8": "www"},
    argv = optimist.usage("\nUsage: $0 [--android] [--blackberry10] [--ios] [--windows8] [--wp8] [-h|--help] [--plugman] [--global] [--skipjs]\n" +
                          "A project will be created with the mobile-spec app and all the core plugins.\n" +
                          "At least one platform must be specified. See the included README.md.")
                   .describe("help", "Shows usage.")
                   .describe("android", "Add Android platform when creating the mobile-spec project.")
                   .describe("blackberry10", "Add Blackberry 10 platform when creating the mobile-spec project.")
                   .describe("ios", "Add iOS platform when creating the mobile-spec project.")
                   .describe("windows8", "Add Windows 8 (desktop) platform when creating the mobile-spec project.")
                   .describe("wp8", "Add Windows Phone 8 when creating the mobile-spec project.")
                   .describe("plugman", "Use /bin/create and plugman directly instead of the CLI.")
                   .describe("global", "Use the globally-installed cordova and the downloaded platforms/plugins from the registry instead of the local git repo. Will use the local git repo of mobile-spec. Generally used only to test RC or production releases. Cannot be used with --plugman.")
                   .describe("skipjs", "Do not update the platform's cordova.js from the js git repo, use the one already present in the platform. Rarely used, generally to test RC releases. Cannot be used with --global because it is implied when --global is used.")
                   .boolean("plugman")
                   .boolean("global")
                   .boolean("skipjs")
                   .alias("h", "help")
                   .argv;


if (!fs.existsSync(mobile_spec_git_dir)) {
    console.log("Please run this script from the directory that contains cordova-mobile-spec");
    shelljs.exit(1);
}

// technically not needed for --global, but we're developers.
if (!fs.existsSync(cordova_js_git_dir)) {
    console.log("Please run this script from the directory that contains cordova-js");
    shelljs.exit(1);
}

if (argv.help) { optimist.showHelp(); return; }
if (argv.android) { platforms.push("android"); }
if (argv.ios) { platforms.push("ios"); }
if (argv.blackberry10) { platforms.push("blackberry10"); }
if (argv.wp8) { platforms.push("wp8"); }
if (argv.windows8) { platforms.push("windows8"); }
if (argv.plugman && argv.global) {
    console.log("The --global option can not be used with the --plugman option.");
    optimist.showHelp();
    return;
}
if (argv.skipjs && argv.global) {
    console.log("The --skipjs option can not be used with the --global option.");
    optimist.showHelp();
    return;
}

// If no platforms, then stop and show help
if (platforms.length === 0){
    console.log("\nNo platforms were selected. Please choose at least one of the supported platforms.");
    optimist.showHelp();
    process.exit(2);
}

// select between the globally-installed one on your path or your local git repo
var cli = argv.global ? "cordova" : cli_local_bin;

// Print relevant information
if (argv.global) {
    console.log("Creating project. Using globally installed cordova and plugman, downloadable platforms and plugins, and local mobile-spec.");
    console.log("To clone needed repositories:");
    console.log("  ./cordova-coho/coho repo-clone -r mobile-spec");
    console.log("To update all repositories:");
    console.log("  ./cordova-coho/coho repo-update -r mobile-spec");
} else {
    console.log("Creating project. If you have any errors, it may be from missing repositories.");
    console.log("To clone needed repositories (android as an example):");
    console.log("  ./cordova-coho/coho repo-clone -r plugins -r mobile-spec -r android -r cli");
    console.log("To update all repositories:");
    console.log("  ./cordova-coho/coho repo-update");
}

// Setting up config.fatal as true, if something goes wrong the program will terminate
shelljs.config.fatal = true;

////////////////////// preparations before project creation

if (argv.global) {
    // clean out cached platforms and plugins and app-hello-world
    var home_dir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    shelljs.rm("-rf", path.join(home_dir, ".cordova"));
    shelljs.rm("-rf", path.join(home_dir, ".plugman"));
}

////////////////////// create the project for each platform

function myDelete(myDir) {
    // Custom function to delete project folder, in case a process has it locked on Windows
    try {
        shelljs.rm("-rf", myDir);
    } catch (e) {
        // The project directory after an Android build and emulation is locked by ADB.EXE (Android Debug Bridge).
        // Kill the process & restart folder deletion
        if (/^win/.test(process.platform)) {
            console.log("Not all files were deleted, killing ADB.EXE process to unlock folder...");
            shelljs.exec("TASKKILL /F /IM ADB.exe /T");
            shelljs.rm("-rf", myDir);
        } else
            throw new Error("Error during folder deletion, try to remove " + myDir + " manually.");
    }
}

function getProjName(platform) {
    return "mobilespec-" + platform;
}

if (argv.plugman) {
    // run the /bin/create script
    platforms.forEach(function (platform) {
        var projName = getProjName(platform);
        myDelete(projName);
        console.log("Creating project " + projName + "...");
        shelljs.exec(platform_layout[platform].bin + path.sep + "bin" + path.sep + "create " + projName + " org.apache.cordova.mobilespecplugman " + projName);
        shelljs.rm("-r", path.join(top_dir, projName, platform_layout[platform].www));
        shelljs.cp("-r", path.join(mobile_spec_git_dir, "*"), path.join(top_dir, projName, platform_layout[platform].www));
    });
} else {
    // Create the project using "cordova create"
    myDelete(cli_project_dir);
    console.log("Creating project mobilespec...");
    shelljs.exec(cli + " create mobilespec org.apache.cordova.mobilespec MobileSpec_Tests --link-to cordova-mobile-spec");

    // Config.json file ---> linked to local libraries
    shelljs.pushd(cli_project_dir);
    var localPlatforms = {
        "id" :    "org.apache.cordova",
        "name" :  "mobilespec",
        "lib" :   { "android" :      { "uri" : top_dir + "cordova-android" },
                    "ios" :          { "uri" : top_dir + "cordova-ios" },
                    "blackberry10" : { "uri" : top_dir + "cordova-blackberry" },
                    "wp8" :          { "uri" : top_dir + "cordova-wp8" },
                    "windows8" :     { "uri" : top_dir + "cordova-windows" }
        }
    };
    if (!argv.global) {
        JSON.stringify(localPlatforms).to(".cordova/config.json");
    }

    // Executing platform Add
    console.log("Adding platforms...");
    platforms.forEach(function (platform) {
        console.log("Adding Platform: " + platform);
        shelljs.exec(cli + " platform add " + platform + " --verbose");
    });
    shelljs.popd();
}

////////////////////// install plugins for each platform

if (argv.plugman) {
    console.log("Adding plugins using plugman...");
    platforms.forEach(function (platform) {
        var projName = getProjName(platform),
            nodeCommand = /^win/.test(process.platform) ? process.argv[0] +" " : "";
        shelljs.pushd(projName);
        // plugin path must be relative and not absolute (sigh)
        shelljs.exec(nodeCommand + path.join(top_dir, "cordova-plugman", "main.js") + 
                     " install --platform " + platform +
                     " --project . --plugin " + path.join("..", "cordova-mobile-spec", "dependencies-plugin") +
                     " --searchpath " + top_dir);
        shelljs.popd();
    });
} else {
    // don't use local git repos for plugins when using --global
    var searchpath = argv.global ? "" : " --searchpath " + top_dir;
    shelljs.pushd(cli_project_dir);
    console.log("Adding plugins using CLI...");
    shelljs.exec(cli + " plugin add " + path.join(mobile_spec_git_dir, "dependencies-plugin") +
                 searchpath);
    shelljs.popd();
}

////////////////////// update js files for each platform from cordova-js

if (argv.skipjs) {
    console.log("Skipping the js update.");
} else if (!argv.global) {
    console.log("Updating js for platforms...");

    shelljs.pushd(cordova_js_git_dir);
    var code = shelljs.exec("grunt").code;
    if (code) {
        console.log("Failed to build js.");
        process.exit(1);
    }
    shelljs.popd();

    platforms.forEach(function (platform) {
        var src = path.join(cordova_js_git_dir, "pkg", "cordova." + (platform === "wp8" ? "windowsphone" : platform) + ".js");
        var dest = argv.plugman ? path.join(top_dir, getProjName(platform), platform_layout[platform].www, "cordova.js") :
                                  path.join(cli_project_dir, "platforms", platform, "platform_www", "cordova.js");
        shelljs.cp("-f", src, dest);
        console.log("Javascript file updated for " + platform);
    });
}

////////////////////// wrap-up

if (argv.plugman) {
    platforms.forEach(function (platform) {
        var projName = getProjName(platform);
        console.log("Done. " + platform + " project created at " + path.join(top_dir, projName));
    });
} else {
    shelljs.pushd(cli_project_dir);

    // Executing cordova prepare
    console.log("Preparing project...");
    shelljs.exec(cli + " prepare");

    if (!argv.global) {
        console.log("Linking CLI...");
        // Writing link files to use Local CLI
        if (/^win/.test(process.platform)) {
            var winBatchFile = "node  " + cli_local_bin + " %*";
            fs.writeFileSync(path.join(cli_project_dir, "cordova.bat"), winBatchFile);
        } else {
            fs.symlinkSync(cli_local_bin, path.join(cli_project_dir, "cordova"));
        }
        console.log("Symlink to CLI created as " + cli_project_dir + path.sep + "cordova");
    }

    shelljs.popd();

    console.log("Done. Project created at " + cli_project_dir);
}

