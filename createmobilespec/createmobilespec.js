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

/*jslint node: true */
'use strict';

var fs            = require("fs"),
    path          = require("path"),
    shelljs,
    optimist;

function quietshell(fn) {
    var config = shelljs.config,
        silent = config.silent;
    try {
        if (!argv.debug) {
            config.silent = true;
        }
        return fn();
    } finally {
        config.silent = silent;
    }
}

function pushd(dir) {
    return quietshell(function() {
        return shelljs.pushd(dir);
    })
}

function popd(dir) {
    return quietshell(function() {
        return shelljs.popd(dir);
    })
}

// Check that we can load dependencies
try {
    shelljs = require("shelljs");
    optimist = require("optimist");
} catch (e) {
    console.error('Missing module. Please run "npm install" from this directory:\n\t' +
                   __dirname);
    process.exit(2);
}

// Vars, folders and libraries. To ensure compatibility cross platform, absolute paths are used instead of relative paths.
var top_dir =             process.cwd() + path.sep,
    cli_local_bin =       path.join(top_dir, "cordova-cli", "bin", "cordova"),
    mobile_spec_git_dir = path.join(top_dir, "cordova-mobile-spec"),
    cordova_js_git_dir =  path.join(top_dir, "cordova-js"),
    platforms =           [],
    // where to find the /bin/create command and www dir in a non-CLI project
    platform_layout =     { "amazon-fireos":{ "bin": ["cordova-amazon-fireos"],
                                              "www": ["assets", "www"],
                                              "config": ["res", "xml"] },
                            "android":      { "bin": ["cordova-android"],
                                              "www": ["assets", "www"],
                                              "config": ["res", "xml"] },
                            "blackberry10": { "bin": ["cordova-blackberry"],
                                              "www": ["www"],
                                              "config": ["www"] },
                            "ios":          { "bin": ["cordova-ios"],
                                              "www": ["www"],
                                              "config": ["CUSTOM"] },
                            "windows8":     { "bin": ["cordova-windows", "windows8"],
                                              "www": ["www"] },
                            "windows":      { "bin": ["cordova-windows", "windows"],
                                              "www": ["www"] },
                            "wp8":          { "bin": ["cordova-wp8", "wp8"],
                                              "www": ["www"] } },
    platform_dirs =       {"amazon-fireos": ["cordova-amazon-fireos"],
                           "android": ["cordova-android"],
                           "blackberry10": ["cordova-blackberry"],
                           "ios": ["cordova-ios"],
                           "windows8": ["cordova-windows", "windows8"],
                           "windows": ["cordova-windows", "windows"],
                           "wp8": ["cordova-wp8", "wp8"]},
    // where to put the cordova.js file in a non-CLI project
    platform_www_dirs =   {"amazon-fireos": ["assets", "www"],
                           "android": ["assets", "www"],
                           "blackberry10": ["www"],
                           "ios": ["www"],
                           "windows8": ["www"],
                           "windows": ["www"],
                           "wp8": ["www"]},
    argv = optimist.usage("\nUsage: $0 PLATFORM... [--help] [--plugman] [--global] [--skipjs] [directoryName]\n" +
                          "A project will be created with the mobile-spec app and all the core plugins.\n" +
                          "At least one platform must be specified. See the included README.md.\n" +
                          "\tPLATFORM: [--<amazon|android|blackberry10|ios|windows|windows8|wp8>]\n" +
                          "")
                   .boolean("help").describe("help", "Shows usage.")
                   .boolean("debug").describe("debug", "Debug logging.")
                   .boolean("amazon").describe("amazon", "Add Amazon FireOS platform.")
                   .boolean("android").describe("android", "Add Android platform.")
                   .boolean("blackberry10").describe("blackberry10", "Add BlackBerry 10 platform.")
                   .boolean("ios").describe("ios", "Add iOS platform.")
                   .boolean("windows").describe("windows", "Add Windows (universal) platform.")
                   .boolean("windows8").describe("windows8", "Add Windows 8 (desktop) platform.")
                   .boolean("wp8").describe("wp8", "Add Windows Phone 8 platform.")
                   .boolean("plugman").describe("plugman", "Use {platform}/bin/create and plugman directly instead of the CLI.")
                   .boolean("global").describe("global", "Use the globally-installed `cordova` and the downloaded platforms/plugins from the registry instead of the local git repo.\n" +
                                               "\t\t\tWill use the local git repo of mobile-spec.\n" +
                                               "\t\t\tGenerally used only to test RC or production releases.\n" +
                                               "\t\t\tCannot be used with --plugman.")
                   .boolean("skipjs").describe("skipjs", "Do not update the platform's cordova.js from the js git repo, use the one already present in the platform.\n" +
                                               "\t\t\tRarely used, generally to test RC releases.\n" +
                                               "\t\t\tCannot be used with --global because it is implied when --global is used.")
                   .alias("h", "help")
                   .argv;

if (!fs.existsSync(mobile_spec_git_dir)) {
    console.log("Please run this script from "+path.dirname(path.dirname(__dirname)));
    shelljs.exit(1);
}

function quit() {
    process.exit(0);
}

if (argv.help) { optimist.showHelp(); quit(); }
if (argv.amazon) { platforms.push("amazon-fireos"); }
if (argv.android) { platforms.push("android"); }
if (argv.ios) { platforms.push("ios"); }
if (argv.blackberry10) { platforms.push("blackberry10"); }
if (argv.wp8) { platforms.push("wp8"); }
if (argv.windows8) { platforms.push("windows8"); }
if (argv.windows) { platforms.push("windows"); }
if (argv.plugman && argv.global) {
    console.log("The --global option can not be used with the --plugman option.");
    optimist.showHelp();
    quit();
}
if (argv.skipjs && argv.global) {
    console.log("The --skipjs option can not be used with the --global option.");
    optimist.showHelp();
    quit();
}

// If no platforms, then stop and show help
if (platforms.length === 0){
    console.log("\nNo platforms were selected. Please choose at least one of the supported platforms.");
    optimist.showHelp();
    process.exit(2);
}

// select between the globally-installed one on your path or your local git repo
var cli = argv.global ? "cordova" : cli_local_bin;

var projectDirName = argv._[0] || "mobilespec";
var cli_project_dir = path.join(top_dir, projectDirName);

// Print relevant information
if (!fs.existsSync(path.join("cordova-coho", "coho"))) {
    console.log("You need to clone cordova-coho:");
    console.log("  git clone https://git-wip-us.apache.org/repos/asf/cordova-coho.git");
}
if (argv.global) {
    console.log("Creating project. Using globally installed cordova and plugman, downloadable platforms and plugins, and local mobile-spec.");
    console.log("To clone needed repositories:");
    console.log("  ./cordova-coho/coho repo-clone -r mobile-spec");
    console.log("To update all repositories:");
    console.log("  ./cordova-coho/coho repo-update -r mobile-spec");
} else {
    var repos = [
        'plugins'
    ];
    console.log("Creating project. If you have any errors, it may be from missing repositories.");
    console.log("To clone base repositories:");
    [
        'cli',
        'lib',
    ].forEach(function(d) {
        if (!fs.existsSync(path.join(path.dirname(path.dirname(__dirname)), 'cordova-'+d))) {
            repos.push(d);
        }
    });
    console.log(["  ./cordova-coho/coho repo-clone"].concat(repos).join(" -r "));
    console.log("  mkdir cordova-cli/node_modules");
    console.log("  (cd cordova-lib/cordova-lib/ && npm install)");
    console.log("  mkdir cordova-cli/node_modules");
    console.log("  ln -s ../../cordova-lib/cordova-lib cordova-cli/node_modules");
    console.log("  (cd cordova-cli && npm install)");
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
    return projectDirName + "-" + platform;
}

function couldNotFind(it, label) {
    var message = "Could not find " + (label || it) + ";\n\trun: ./cordova-coho/coho repo-clone -r " + it;
    console.error(message);
}

function join_paths(paths) {
    return path.join.apply(null, paths);
}

if (argv.plugman) {
    // run the /bin/create script
    [].concat(platforms).forEach(function (platform) {
        if (!fs.existsSync(platform_layout[platform].bin[0])) {
            couldNotFind(platform_layout[platform].bin[0], platform);
            platforms = platforms.filter(function (p) { return p != platform; });
            return;
        }
        var projName = getProjName(platform);
        myDelete(projName);
        console.log("Creating project " + projName + "...");
        shelljs.exec(join_paths(platform_layout[platform].bin.concat("bin", "create ")) + projName + " org.apache.cordova.mobilespecplugman " + projName);
        shelljs.rm("-r", join_paths([top_dir, projName].concat(platform_layout[platform].www)));
        shelljs.cp("-r", path.join(mobile_spec_git_dir, "www", "*"), join_paths([top_dir, projName].concat(platform_layout[platform].www)));
        var configPath = platform == 'ios' ? getProjName(platform) : 'config' in platform_layout[platform] ? join_paths(platform_layout[platform].config) : null;
        if (configPath) {
          shelljs.cp("-f", path.join(mobile_spec_git_dir, "config.xml"), path.join(top_dir, projName, configPath));
        } else {
          shelljs.cp("-f", path.join(mobile_spec_git_dir, "config.xml"), path.join(top_dir, projName));
          console.warn('createmobilespec doesn\'t know where config.xml goes for platform ' + platform);
        }
    });
} else {
    // Create the project using "cordova create"
    myDelete(cli_project_dir);
    console.log("Creating project mobilespec...");
    shelljs.exec(cli + " create " + projectDirName + " org.apache.cordova.mobilespec MobileSpec_Tests --link-to cordova-mobile-spec/www");
    shelljs.cp("-f", path.join(mobile_spec_git_dir, 'config.xml'), path.join(projectDirName, 'config.xml'));

    // Config.json file ---> linked to local libraries
    pushd(cli_project_dir);
    var localPlatforms = {
        "amazon-fireos" : [top_dir, "cordova-amazon-fireos"],
        "android" : [top_dir, "cordova-android"],
        "ios" : [top_dir, "cordova-ios"],
        "blackberry10" : [top_dir, "cordova-blackberry"],
        "wp8" : [top_dir, "cordova-wp8", "wp8"],
        "windows8" : [top_dir, "cordova-windows"],
        "windows" : [top_dir, "cordova-windows", "windows"]
    };

    // Executing platform Add
    console.log("Adding platforms...");
    [].concat(platforms).forEach(function (platform) {
        console.log("Adding Platform: " + platform);
        var platformArg;
        if (argv.global) {
            platformArg = platform;
        } else {
            platformArg = path.join.apply(null, localPlatforms[platform]);
            if (!fs.existsSync(platformArg)) {
                couldNotFind(localPlatforms[platform][1], platform);
                platforms = platforms.filter(function (p) { return p != platform; });
                return;
            }
        }
        console.log("platformArg: " + cli + " " + platformArg);
        shelljs.exec(cli + ' platform add "' + platformArg + '" --verbose');
    });
    popd();
}

////////////////////// install plugins for each platform
function installPlugins() {
    if (argv.plugman) {
        console.log("Adding plugins using plugman...");
        if (!fs.existsSync(path.join(top_dir, "cordova-plugman"))) {
            couldNotFind('plugman');
            console.log("  mkdir cordova-plugman/node_modules");
            console.log("  ln -s ../../cordova-lib/cordova-lib cordova-plugman/node_modules");
            return;
        }
        platforms.forEach(function (platform) {
            var projName = getProjName(platform),
                nodeCommand = /^win/.test(process.platform) ? process.argv[0] +" " : "";
            pushd(projName);
            // plugin path must be relative and not absolute (sigh)
            shelljs.exec(nodeCommand + path.join(top_dir, "cordova-plugman", "main.js") +
                         " install --platform " + platform +
                         " --project . --plugin " + path.join("..", "cordova-mobile-spec", "dependencies-plugin") +
                         " --searchpath " + top_dir);
            popd();
        });
    } else {
        // don't use local git repos for plugins when using --global
        var searchpath = argv.global ? "" : " --searchpath " + top_dir;
        console.log("Adding plugins using CLI...");
        console.log("Searchpath:", searchpath);
        if (!fs.existsSync('cordova-plugin-test-framework')) {
            couldNotFind('cordova-plugin-test-framework');
        }
        pushd(cli_project_dir);
        shelljs.exec(cli + " plugin add " + path.join(mobile_spec_git_dir, "dependencies-plugin") +
                     searchpath);
        popd();
    }

////////////////////// install new-style test plugins
    if (argv.plugman) {
      // TODO
    } else {
        pushd(cli_project_dir);
        console.log("Adding plugin tests using CLI...");
        shelljs.ls('plugins').forEach(function(plugin) {
          var potential_tests_plugin_xml = path.join('plugins', plugin, 'tests', 'plugin.xml');
          if (fs.existsSync(potential_tests_plugin_xml)) {
            shelljs.exec(cli + " plugin add " + path.dirname(potential_tests_plugin_xml));
          }
        });
        popd();
    }
}

////////////////////// update js files for each platform from cordova-js
function updateJS() {
    if (argv.skipjs) {
        console.log("Skipping the js update.");
    } else if (!argv.global) {
        if (!fs.existsSync(cordova_js_git_dir)) {
            couldNotFind("js", "cordova-js");
        } else {
            console.log("Updating js for platforms...");
            try {
                require(path.join(cordova_js_git_dir, "node_modules", "grunt"));
            } catch (e) {
                console.error("Grunt isn't installed in cordova-js, you need to:\n\trun `npm install` from: "+ cordova_js_git_dir);
            }

            pushd(cordova_js_git_dir);
            var nodeCommand = /^win/.test(process.platform) ? process.argv[0] + " " : "";
            var code = shelljs.exec(nodeCommand + path.join(__dirname, "node_modules", "grunt-cli", "bin", "grunt")).code;
            if (code) {
                console.log("Failed to build js.");
                process.exit(1);
            }
            popd();

            platforms.forEach(function (platform) {
                var src = path.join(cordova_js_git_dir, "pkg", "cordova." + (platform === "wp8" ? "windowsphone" : platform) + ".js");
                var dest = argv.plugman ? join_paths([top_dir, getProjName(platform)].concat(platform_layout[platform].www), "cordova.js") :
                                          path.join(cli_project_dir, "platforms", platform, "platform_www", "cordova.js");
                shelljs.cp("-f", src, dest);
                console.log("JavaScript file updated for " + platform);
            });
        }
    }
}

////////////////////// wrap-up

function summary() {
    if (argv.plugman) {
        platforms.forEach(function (platform) {
            var projName = getProjName(platform);
            console.log("Done. " + platform + " project created at " + path.join(top_dir, projName));
        });
    } else {
        pushd(cli_project_dir);

        // Executing cordova prepare
        console.log("Preparing project...");
        shelljs.exec(cli + " prepare");

        if (!argv.global) {
            console.log("Linking CLI...");
            // Writing link files to use Local CLI
            if (/^win/.test(process.platform)) {
                var winBatchFile = "node  " + cli_local_bin + " %*";
                fs.writeFileSync(path.join(cli_project_dir, "cordova.bat"), winBatchFile);
                console.log("Batch file for CLI created as " + path.join(cli_project_dir, "cordova.bat"));
            } else {
                fs.symlinkSync(cli_local_bin, path.join(cli_project_dir, "cordova"));
                console.log("Symlink to CLI created as " + path.join(cli_project_dir, "cordova"));
            }
        }

        popd();

        console.log("Done. Project created at " + cli_project_dir);
    }
}

if (platforms.length) {
    installPlugins();
    updateJS();
    summary();
}
