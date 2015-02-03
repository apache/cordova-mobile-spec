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

var startTime = Date.now();

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
    });
}

function popd(dir) {
    return quietshell(function() {
        return shelljs.popd(dir);
    });
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
                            "windows8":     { "bin": ["cordova-windows"],
                                              "www": ["www"] },
                            "windows":      { "bin": ["cordova-windows"],
                                              "www": ["www"] },
                            "wp8":          { "bin": ["cordova-wp8"],
                                              "www": ["www"] } },
    argv = optimist.usage("\nUsage: $0 PLATFORM... [--help] [--plugman] [--link] [--global] [--globalplugins] [--skipjs] [--skiplink] [directoryName]\n" +
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
                   .boolean("globalplugins").describe("globalplugins", "Use the plugins from the remote registry instead of the local git repo.\n" +
                                                      "\t\t\tRarely used, generally to test platform releases.\n" +
                                                      "\t\t\tCannot be used with --global because it is implied when --global is used.")
                   .boolean("skipjs").describe("skipjs", "Do not update the platform's cordova.js from the js git repo, use the one already present in the platform.\n" +
                                               "\t\t\tRarely used, generally to test RC releases.\n" +
                                               "\t\t\tCannot be used with --global because it is implied when --global is used.")
                   .boolean("skiplink").describe("skiplink", "Do not check 'npm link' of our own dependent modules such as cordova-lib when on master.\n" +
                                                 "\t\t\tUse only when you know what you are doing, this should be very rare.")
                   .boolean("linkplugins").describe("linkplugins", "Use the --link flag when running `cordova plugin add`.\n")
                   .boolean("linkplatforms").describe("linkplatforms", "Use the --link flag when running `cordova platform add`.\n")
                   .boolean("link").describe("link", "Alias for --linkplugins --linkplatforms.\n")
                   .boolean("browserify").describe("browserify", "Use the --browserify flag when running `cordova plugin add`.\n")
                   .boolean("telerikplugins").describe("telerikplugins", "Adds a bunch of known-to-be-popular plugins from Telerik-Verified-Plugins.\n")
                   .boolean("cprplugins").describe("cprplugins", "Adds a bunch of known-to-be-popular plugins from Cordova Plugin Regsitry.\n")
                   .boolean("plugregplugins").describe("cprplugins", "Adds a bunch of known-to-be-popular plugins from PlugReg (that are not on the CPR).\n")
                   .boolean("thirdpartyplugins").describe("thirdpartyplugins", "Alias for --telerikplugins --cprplugins --plugregplugins.\n")
                   .alias("h", "help")
                   .argv;

// List generated based on download counts on registry.
var CORDOVA_REGISTRY_PLUGINS = [
    'com.ionic.keyboard',
    'com.google.playservices',
    'de.appplant.cordova.plugin.local-notification',
    'com.phonegap.plugins.barcodescanner',
    'com.cranberrygame.phonegap.plugin.ad.admob',
    // 'com.google.cordova.admob', // these two conflict. Use the most popular one.
    // 'com.google.admob',
    // Currently need an git version of this to fix a bug in published version.
    // It's a dep of plugin.google.maps
    'https://github.com/wf9a5m75/phonegap-http-request.git',
    'plugin.google.maps',
    'com.rjfun.cordova.extension',
    'net.yoik.cordova.plugins.screenorientation',
    'de.appplant.cordova.plugin.email-composer',
    'com.msopentech.azure-mobile-services',
    // 'com.phonegap.plugins.pushplugin', // This one bundles play services, causing duplicate symbols
    'com.phonegap.plugins.facebookconnect',
    'com.danielcwilson.plugins.googleanalytics'
];
// Commented out plugins are popular, but duplicate those in CPR.
var TELERIK_VERIFIED_PLUGINS = [
    'https://github.com/Telerik-Verified-Plugins/Flashlight',
    'https://github.com/Telerik-Verified-Plugins/SocialSharing',
    'https://github.com/Telerik-Verified-Plugins/ActionSheet',
    'https://github.com/Telerik-Verified-Plugins/Calendar',
    // 'https://github.com/Telerik-Verified-Plugins/EmailComposer',
    'https://github.com/Telerik-Verified-Plugins/NativePageTransitions',
    'https://github.com/Telerik-Verified-Plugins/Toast',
    // 'https://github.com/Telerik-Verified-Plugins/BarcodeScanner',
    'https://github.com/Telerik-Verified-Plugins/Keychain',
    // 'https://github.com/Telerik-Verified-Plugins/Keyboard',
    'https://github.com/Telerik-Verified-Plugins/NFC',
    'https://github.com/Telerik-Verified-Plugins/AppVersion',
    'https://github.com/Telerik-Verified-Plugins/PrivacyScreen'
];
var PLUGREG_PLUGINS = [
    'https://github.com/brodysoft/Cordova-SQLitePlugin.git',
    // 'https://github.com/wildabeast/BarcodeScanner.git',
    // 'https://github.com/phonegap-build/PushPlugin.git',
];

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
if (argv.globalplugins && argv.global) {
    console.log("The --globalplugins option can not be used with the --global option.");
    optimist.showHelp();
    quit();
}
if (argv.skiplink && argv.global) {
    console.log("The --skiplink option can not be used with the --global option.");
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
var browserifyFlag = argv.browserify ? ' --browserify' : '';

// Print relevant information
if (!fs.existsSync(path.join("cordova-coho", "coho"))) {
    console.log("You need to clone cordova-coho:");
    console.log("  git clone https://git-wip-us.apache.org/repos/asf/cordova-coho.git");
    process.exit(3);
}
if (argv.global) {
    console.log("Creating project. Using globally installed tools, downloadable platforms and plugins, and local mobile-spec.");
    console.log("To clone needed repositories:");
    console.log("  ./cordova-coho/coho repo-clone -r mobile-spec");
    console.log("To update all repositories:");
    console.log("  ./cordova-coho/coho repo-update -r mobile-spec");
} else {
    var repos = [ ];
    repos.push("mobile-spec", "plugin-test-framework", "cli", "lib", "plugman");
    platforms.forEach(function(p) {
        repos.push(p);
    });
    if (!argv.skipjs) {
        repos.push("js");
    }
    if (argv.globalplugins) {
        console.log("Creating project from downloadable plugins, local tools and platforms, and local mobile-spec. If you have any errors, it may be from missing repositories.");
    } else {
        console.log("Creating project from local git repos. If you have any errors, it may be from missing repositories.");
        repos.push("plugins");
    }

    console.log("To clone repositories:");
    console.log(["  ./cordova-coho/coho repo-clone"].concat(repos).join(" -r "));
    if (!argv.globalplugins) {
        console.log("  mkdir cordova-cli/node_modules");
        console.log("  (cd cordova-lib/cordova-lib/ && npm install)");
        console.log("  (cd cordova-plugman/ && npm install)");
        console.log("  mkdir cordova-cli/node_modules");
        console.log("  ln -s ../../cordova-lib/cordova-lib cordova-cli/node_modules");
        console.log("  (cd cordova-cli && npm install)");
    }
    console.log("To update all repositories:");
    console.log("  ./cordova-coho/coho repo-update");
}

// Setting up config.fatal as true, if something goes wrong the program will terminate
shelljs.config.fatal = true;

////////////////////// preparations before project creation

if (argv.global || argv.globalplugins) {
    // clean out cached platforms and plugins and app-hello-world
    var home_dir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    shelljs.rm("-rf", path.join(home_dir, ".cordova/npm_cache"));
    shelljs.rm("-rf", path.join(home_dir, ".plugman"));
}

function getPathFromModuleName(moduleName) {
    if (moduleName == "cordova-lib") {
        return(moduleName + path.sep + moduleName);
    } else {
        return(moduleName);
    }
}

function cdInto(moduleName) {
    var myPath = getPathFromModuleName(moduleName);
    pushd(myPath);
}

function cdOutOf() {
    popd();
}

function getBranchName(moduleName) {
    var isConfigFatal = shelljs.config.fatal;
    shelljs.config.fatal = false;
    cdInto(moduleName);
    try {
        // output should look like: refs/head/master
        var gitOutput = shelljs.exec("git symbolic-ref HEAD").output;
        shelljs.config.fatal = isConfigFatal;
        var match = /refs\/heads\/(.*)/.exec(gitOutput);
        if (!match) {
            if (gitOutput.indexOf("is not a symbolic ref") > -1) {
                return "detached from HEAD";
            }
            throw new Error('Could not parse branch name from: ' + gitOutput + '(in module ' + moduleName + ')');
        }
        return match[1];
    } finally {
        cdOutOf();
    }
}

function verifyNpmLinkOf(linkedModule, installedModule) {
    cdInto(installedModule);
    var linkedPath = shelljs.pwd() + path.sep + "node_modules" + path.sep + linkedModule;
    if (fs.existsSync(linkedPath)) {
        var myStat = fs.lstatSync(linkedPath);
        if (!myStat.isSymbolicLink()) {
            throw new Error('Module ' + linkedModule + ' installed in ' + installedModule + ' is not npm-linked. I recommend you run "coho npm-link".');
        }
    } else {
        throw new Error('Module ' + linkedModule + ' is not installed at all (direct or npm-linked) in ' + installedModule);
    }
    cdOutOf();
}

if (!argv.skiplink) {
    console.log("Checking if you are using master branch of tools");
    // if js, lib, plugman, and cli have master checked out, should npm link.
    var jsBranch = getBranchName("cordova-js");
    var libBranch = getBranchName("cordova-lib");
    var plugmanBranch = getBranchName("cordova-plugman");
    var cliBranch = getBranchName("cordova-cli");
    if ((jsBranch == "master") && (libBranch == "master") && (plugmanBranch == "master") && (cliBranch == "master")) {
        // make sure the dependent modules are 'npm link'ed to each other,
        // so they actually get tested instead of downloading the last published
        // one from the npm registry. Fail if they are not.
        console.log("You are on master branch of tools, checking npm links");
        verifyNpmLinkOf("cordova-js", "cordova-lib");
        verifyNpmLinkOf("cordova-lib", "cordova-plugman");
        verifyNpmLinkOf("cordova-lib", "cordova-cli");
        console.log("npm links are OK");
    } else {
        console.log("Using non-master of one or more tools.");
    }
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

    // Executing platform Add
    console.log("Adding platforms...");
    [].concat(platforms).forEach(function (platform) {
        console.log("Adding Platform: " + platform);
        var platformArg;
        if (argv.global) {
            platformArg = platform;
        } else {
            platformArg = join_paths([top_dir].concat(platform_layout[platform].bin));
            if (!fs.existsSync(platformArg)) {
                couldNotFind(platformArg, platform);
                platforms = platforms.filter(function (p) { return p != platform; });
                return;
            }
        }
        console.log("platformArg: " + cli + " " + platformArg);
        var linkPlatformsFlag = (argv.link || argv.linkplatforms) ? ' --link' : '';
        shelljs.exec(cli + ' platform add "' + platformArg + '" --verbose' + linkPlatformsFlag);
        if (platform == 'android') {
            shelljs.cp(path.join(__dirname, 'helper_files', 'android-debug-key.properties'), path.join('platforms', 'android'));
            shelljs.cp(path.join(__dirname, 'helper_files', 'android-debug-key.p12'), path.join('platforms', 'android'));
            shelljs.cp(path.join(__dirname, 'helper_files', 'build-extras.gradle'), path.join('platforms', 'android'));
        }
    });
    popd();
}

////////////////////// install plugins for each platform
function installPlugins() {
    if (argv.plugman) {
        console.log("Adding plugins using plugman...");
        if (!fs.existsSync(path.join(top_dir, "cordova-plugman"))) {
            couldNotFind('plugman');
            console.log("  cd cordova-plugman");
            console.log("  npm link cordova-lib && npm install");
            return;
        }
        platforms.forEach(function (platform) {
            var projName = getProjName(platform),
                nodeCommand = /^win/.test(process.platform) ? ("\"" + process.argv[0] + "\" ") : "";
            pushd(projName);
            // plugin path must be relative and not absolute (sigh)
            shelljs.exec(nodeCommand + path.join(top_dir, "cordova-plugman", "main.js") +
                         " install --platform " + platform +
                         " --project . --plugin " + path.join("..", "cordova-mobile-spec", "dependencies-plugin") +
                         " --searchpath " + top_dir + browserifyFlag);

            // Install new-style test plugins
            console.log("Adding plugin tests using plugman...");
            var plugin_path = join_paths(platform_layout[platform].www.concat(["plugins"]));
            shelljs.ls(plugin_path).forEach(function(plugin) {
                var id_elts = plugin.split(".");
                var plugin_name = "cordova-plugin-" + id_elts[id_elts.length - 1];
                var potential_tests_plugin_xml = path.join(top_dir, plugin_name, 'tests', 'plugin.xml');
                if (fs.existsSync(potential_tests_plugin_xml)) {
                    shelljs.exec(nodeCommand + path.join(top_dir, "cordova-plugman", "main.js") +
                                " install --platform " + platform +
                                " --project . --plugin " + path.dirname(potential_tests_plugin_xml) + browserifyFlag);
                }
            });
            popd();
        });
    } else {
        // don't use local git repos for plugins when using --global.
        var searchpath = argv.global ? "" : " --searchpath " + top_dir;
        console.log("Adding plugins using CLI...");
        console.log("Searchpath:", searchpath);
        if (!fs.existsSync('cordova-plugin-test-framework')) {
            couldNotFind('cordova-plugin-test-framework');
        }
        pushd(cli_project_dir);
        // we do need local plugin-test-framework
        console.log("Installing local test framework plugins...");
        var linkPluginsFlag = (argv.link || argv.linkplugins) ? ' --link' : '';
        shelljs.exec(cli + " plugin add org.apache.cordova.test.whitelist org.apache.cordova.test.echo --searchpath " + mobile_spec_git_dir + linkPluginsFlag + browserifyFlag);
        shelljs.exec(cli + " plugin add org.apache.cordova.test-framework --searchpath " + top_dir + linkPluginsFlag + browserifyFlag);

        if (argv.globalplugins) {
            shelljs.exec(cli + " plugin add " + path.join(mobile_spec_git_dir, "dependencies-plugin") + linkPluginsFlag + browserifyFlag);
        } else {
            shelljs.exec(cli + " plugin add " + path.join(mobile_spec_git_dir, "dependencies-plugin") + searchpath + linkPluginsFlag + browserifyFlag);
        }
        
        if (argv.thirdpartyplugins || argv.cprplugins) {
            shelljs.exec(cli + " plugin add " + CORDOVA_REGISTRY_PLUGINS.join(' ') + searchpath + browserifyFlag + ' --variable API_KEY_FOR_ANDROID="AIzaSyBICVSs9JqT7WdASuN5HSe7w-pCE0n_X88" --variable API_KEY_FOR_IOS="AIzaSyAikyYG24YYFvq5Vy41P5kppsfO2GgF9jM"');
            // Delete duplicate <uses-permission> due to maxSdk (CB-8401)
            shelljs.sed('-i', /{[^{]*(maxSdk|WRITE_EXTERNAL_STORAGE).*?(maxSdk|WRITE_EXTERNAL_STORAGE)[^}]*},/, '', path.join('plugins', 'android.json'));
            shelljs.sed('-i', /<.*(maxSdk|WRITE_EXTERNAL_STORAGE).*(maxSdk|WRITE_EXTERNAL_STORAGE).*>/, '', path.join('platforms', 'android', 'AndroidManifest.xml'));
        }
        if (argv.thirdpartyplugins || argv.telerikplugins) {
            shelljs.exec(cli + " plugin add " + TELERIK_VERIFIED_PLUGINS.join(' ') + searchpath + browserifyFlag);
        }
        if (argv.thirdpartyplugins || argv.plugregplugins) {
            shelljs.exec(cli + " plugin add " + PLUGREG_PLUGINS.join(' ') + searchpath + browserifyFlag);
        }

        // Install new-style test plugins
        console.log("Adding plugin tests using CLI...");
        var pluginTestPaths = [];
        shelljs.ls('plugins').forEach(function(plugin) {
          var potential_tests_plugin_xml = path.join('plugins', plugin, 'tests', 'plugin.xml');
          if (fs.existsSync(potential_tests_plugin_xml)) {
            pluginTestPaths.push(path.resolve(path.dirname(potential_tests_plugin_xml)));
          }
        });
        shelljs.exec(cli + " plugin add " + pluginTestPaths.join(' ') + linkPluginsFlag + browserifyFlag);

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

            platforms.forEach(function (platform) {
                var version = require(join_paths([top_dir].concat(platform_layout[platform].bin)) + '/package').version;
                pushd(cordova_js_git_dir);
                var nodeCommand = /^win/.test(process.platform) ? ("\"" + process.argv[0] + "\" ") : "";
                var code = shelljs.exec(nodeCommand + path.join(__dirname, "node_modules", "grunt-cli", "bin", "grunt") + ' compile:' + platform + ' --platformVersion=' + version).code;
                if (code) {
                    console.log("Failed to build js.");
                    process.exit(1);
                }
                popd();

                var src = path.join(cordova_js_git_dir, "pkg", "cordova." + platform + ".js");
                var dest = argv.plugman ? join_paths([top_dir, getProjName(platform)].concat(platform_layout[platform].www).concat(["cordova.js"])) :
                                          path.join(cli_project_dir, "platforms", platform, "platform_www", "cordova.js");
                shelljs.cp("-f", src, dest);
                console.log("JavaScript file updated for " + platform);
            });
        }
    }
}

////////////////////// wrap-up

function summary() {
    var scriptTimeStr = 'Script took ' + Math.round((Date.now() - startTime)/100)/10 + ' seconds';
    if (argv.plugman) {
        platforms.forEach(function (platform) {
            var projName = getProjName(platform);
            console.log("Done. " + platform + " project created at " + path.join(top_dir, projName));
        });
        console.log(scriptTimeStr);
    } else {
        pushd(cli_project_dir);

        // Executing cordova prepare
        console.log("Preparing project...");
        shelljs.exec(cli + " prepare" + browserifyFlag);

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
        console.log(scriptTimeStr);
        console.log("You may run it via \"cd " + cli_project_dir + " && ./cordova run " + platforms[0] + "\"");
    }
}

if (platforms.length) {
    updateJS();
    installPlugins();
    summary();
}
