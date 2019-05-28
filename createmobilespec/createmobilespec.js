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

// helpers
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

function pluginAdd(pluginName, searchPath, extraFlags) {
    if (!pluginName) {
        return;
    }
    if (!searchPath || typeof searchPath !== "string") {
        searchPath = '';
    }
    var command = cli + ' plugin add ' + pluginName;
    if (fs.existsSync(path.join(searchPath, pluginName, 'plugin.xml'))) {
        command = cli + ' plugin add ' + path.join(searchPath, pluginName);
    } else if (searchPath && searchPath.length) {
        command = cli + ' plugin add ' + pluginName + ' --searchpath ' + searchPath;
    }
    if (extraFlags) {
        command += extraFlags;
    }
    executeShellCommand(command);
}

function executeShellCommand(command) {
    console.log('$ ' + command);
    return shelljs.exec(command);
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
    platform_layout =     { "android":      { "bin": ["cordova-android"],
                                              "www": ["assets", "www"],
                                              "config": ["res", "xml"] },
                            "browser": { "bin": ["cordova-browser"],
                                              "www": ["www"],
                                              "config": ["www"] },
                            "electron": { "bin": ["cordova-electron"],
                                              "www": ["www"],
                                              "config": ["www"] },
                            "ios":          { "bin": ["cordova-ios"],
                                              "www": ["www"],
                                              "config": ["CUSTOM"] },
                            "osx":          { "bin": ["cordova-osx"],
                                              "www": ["www"] },
                            "windows":      { "bin": ["cordova-windows"],
                                              "www": ["www"] }
                            },
    argv = optimist.usage("\nUsage: $0 PLATFORM... [--help] [--plugman] [--link] [--global] [--globalplugins] [--plugins=\".\\myPluginDir\"] [--skipjs] [--skiplink] [--variable VAR=\"value\"] [directoryName]\n" +
                          "A project will be created with the mobile-spec app and all the core plugins.\n" +
                          "At least one platform must be specified. See the included README.md.\n" +
                          "\tPLATFORM: [--<android|browser|electron|ios|osx|windows>]\n" +
                          "")
                   .boolean("help").describe("help", "Shows usage.")
                   .boolean("debug").describe("debug", "Debug logging.")
                   .boolean("android").describe("android", "Add Android platform.")
                   .boolean("browser").describe("browser", "Add Browser platform.")
                   .boolean("electron").describe("electron", "Add Electron platform.")
                   .boolean("ios").describe("ios", "Add iOS platform.")
                   .boolean("osx").describe("osx", "Add osx platform (macOS).")
                   .boolean("windows").describe("windows", "Add Windows (universal) platform.")
                   .boolean("plugman").describe("plugman", "Use {platform}/bin/create and plugman directly instead of the CLI.")
                   .boolean("global").describe("global", "Use the globally-installed `cordova` and the downloaded platforms/plugins from the registry instead of the local git repo.\n" +
                                               "\t\t\tWill use the local git repo of mobile-spec.\n" +
                                               "\t\t\tGenerally used only to test RC or production releases.\n" +
                                               "\t\t\tCannot be used with --plugman.")
                   .boolean("globalplugins").describe("globalplugins", "Use the plugins from the remote registry instead of the local git repo.\n" +
                                                      "\t\t\tRarely used, generally to test platform releases.\n" +
                                                      "\t\t\tCannot be used with --global because it is implied when --global is used.")
                   .boolean("clearnpmcache").describe("clearnpmcache", "rm -rf ~/.npm/cache; rm -rf ~/.plugman")
                   .string("plugins").describe("plugins", "Used to explicitly specify the list of plugins to be installed.\n" +
                                               "\t\t\tExample: --plugins=\"cordova-plugin-device cordova-plugin-file-transfer my-custom-plugin\"")
                   .boolean("forceplugins").describe("forceplugins", "Add the --force flag when adding plugins\n")
                   .string("variable").describe("variable", "Used to pass preferences / variables down to cordova components (like plugins).\n" +
                                               "\t\t\tExample: --variable FILETRANSFER_SERVER_ADDRESS=\"http://yourlocal-IPAddressHere:5000\"")
                   .boolean("skipjs").describe("skipjs", "Do not update the platform's cordova.js from the js git repo, use the one already present in the platform.\n" +
                                               "\t\t\tRarely used, generally to test RC releases.\n" +
                                               "\t\t\tCannot be used with --global because it is implied when --global is used.")
                   .boolean("skiplink").describe("skiplink", "Do not check 'npm link' of our own dependent modules such as cordova-lib when on master.\n" +
                                                 "\t\t\tUse only when you know what you are doing, this should be very rare.")
                   .boolean("linkplugins").describe("linkplugins", "Use the --link flag when running `cordova plugin add`.\n")
                   .boolean("linkplatforms").describe("linkplatforms", "Use the --link flag when running `cordova platform add`.\n")
                   .boolean("link").describe("link", "Alias for --linkplugins --linkplatforms.\n")
                   .alias("h", "help")
                   .argv;

var DEFAULT_PLUGINS = [
    'cordova-plugin-battery-status',
    'cordova-plugin-camera',
    'cordova-plugin-console',
    'cordova-plugin-contacts',
    'cordova-plugin-device',
    'cordova-plugin-device-motion',
    'cordova-plugin-device-orientation',
    'cordova-plugin-dialogs',
    'cordova-plugin-file',
    'cordova-plugin-file-transfer',
    'cordova-plugin-geolocation',
    'cordova-plugin-globalization',
    'cordova-plugin-inappbrowser',
    'cordova-plugin-media',
    'cordova-plugin-media-capture',
    'cordova-plugin-network-information',
    'cordova-plugin-splashscreen',
    'cordova-plugin-statusbar',
    'cordova-plugin-vibration',
    'cordova-plugin-whitelist',
    // TODO check if all are listed
];

// osx platform (macOS) has little support for the most of the plugins,
// so it gets its own default list
var DEFAULT_PLUGINS_OSX = [
    'cordova-plugin-camera',
    'cordova-plugin-device',
    'cordova-plugin-file',
    'cordova-plugin-inappbrowser',
    // non-functional on osx platform (macOS), iOS,
    // or any other non-Android platforms:
    'cordova-plugin-whitelist',
];

// plugin search paths that will override default
// removed 'org.apache.cordova.test.whitelist': mobile_spec_git_dir,
var SEARCH_PATHS = {
    'org.apache.cordova.mobilespec.tests': mobile_spec_git_dir,   
    'org.apache.cordova.test.echo': mobile_spec_git_dir,
    'cordova-plugin-test-framework': top_dir
};

if (!fs.existsSync(mobile_spec_git_dir)) {
    console.log("Please run this script from "+path.dirname(path.dirname(__dirname)));
    shelljs.exit(1);
}

function quit() {
    process.exit(0);
}

if (argv.help) { optimist.showHelp(); quit(); }
if (argv.android) { platforms.push("android"); }
if (argv.ios) { platforms.push("ios"); }
if (argv.browser) { platforms.push("browser"); }
if (argv.electron) { platforms.push("electron"); }
if (argv.windows) { platforms.push("windows"); }
if (argv.osx) {platforms.push("osx");}

argv.skiplink = argv.skiplink || argv.global;
argv.skipjs = argv.skipjs || argv.global;
argv.globalplugins = argv.globalplugins || argv.global;

if (argv.plugman && argv.global) {
    console.log("The --global option can not be used with the --plugman option.");
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
var variableFlag = '';
// some plugins support setting config.xml <preference> elements via a --variable flag.
if (argv.variable) {
    if (argv.variable instanceof Array) {
        // multiple variables passed in, compose them all into one string
        variableFlag = ' ' + argv.variable.map(function(v) { return '--variable ' + v; }).join(' ');
    } else {
        variableFlag = ' --variable ' + argv.variable;
    }
}

// Print relevant information
if (!fs.existsSync(path.join("cordova-coho", "coho"))) {
    console.log("You need to clone cordova-coho:");
    console.log("  git clone https://github.com/apache/cordova-coho.git");
    process.exit(3);
}
if (argv.global) {
    console.log("### Creating project. Using globally installed tools, downloadable platforms and plugins, and local mobile-spec.");
    console.log("To clone needed repositories:");
    console.log("  ." + path.sep + "cordova-coho" + path.sep + "coho repo-clone -r mobile-spec");
    console.log("To update all repositories:");
    console.log("  ." + path.sep + "cordova-coho" + path.sep + "coho repo-update -r mobile-spec");
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
        console.log("### Creating project from downloadable plugins, local tools and platforms, and local mobile-spec. If you have any errors, it may be from missing repositories.");
    } else {
        console.log("### Creating project from local git repos. If you have any errors, it may be from missing repositories.");
        repos.push("plugins");
    }

    console.log("To clone repositories:");
    console.log(["  ." + path.sep + "cordova-coho" + path.sep + "coho repo-clone"].concat(repos).join(" -r "));
    if (!argv.globalplugins) {
        console.log("  mkdir cordova-cli" + path.sep + "node_modules");
        console.log("  (cd cordova-lib && npm install)");
        console.log("  (cd cordova-plugman" + path.sep + " && npm install)");
        console.log("  mkdir cordova-cli" + path.sep + "node_modules");
        console.log("  ln -s .." + path.sep + ".." + path.sep + "cordova-lib cordova-cli" + path.sep + "node_modules");
        console.log("  (cd cordova-cli && npm install)");
    }
    console.log("To update all repositories:");
    console.log("  ." + path.sep + "cordova-coho" + path.sep + "coho repo-update");
}

// Setting up config.fatal as true, if something goes wrong the program will terminate
shelljs.config.fatal = true;

////////////////////// preparations before project creation

if (argv.clearnpmcache) {
    // clean out cached platforms and plugins and app-hello-world
    var home_dir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    shelljs.rm("-rf", path.join(home_dir, ".cordova", "npm_cache"));
    shelljs.rm("-rf", path.join(home_dir, ".plugman"));
}

function cdInto(moduleName) {
    pushd(moduleName);
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
        var gitOutput = executeShellCommand("git symbolic-ref HEAD").output;
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
    console.log("Checking if you are using master branch of tools (js, lib, plugman, cli)");
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
        //verifyNpmLinkOf("cordova-js", "cordova-lib"); TODO Clean up other cordova-js stuff above
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
            executeShellCommand("TASKKILL /F /IM ADB.exe /T");
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
        console.log("### Creating project " + projName + "...");
        executeShellCommand(join_paths(platform_layout[platform].bin.concat("bin", "create ")) + projName + " org.apache.cordova.mobilespecplugman " + projName);
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
    console.log("### Creating project mobilespec...");
    executeShellCommand(cli + " create " + projectDirName + " org.apache.cordova.mobilespec MobileSpec_Tests --template cordova-mobile-spec" + path.sep + "www");
    shelljs.cp("-f", path.join(mobile_spec_git_dir, 'config.xml'), path.join(projectDirName, 'config.xml'));

    // Config.json file ---> linked to local libraries
    pushd(cli_project_dir);

    // Executing platform Add
    console.log("### Adding platforms...");
    [].concat(platforms).forEach(function (platform) {
        console.log("### Adding Platform: " + platform);
        var platformArg;
        if (argv.global) {
            platformArg = platform;
        } else {
            platformArg = join_paths([top_dir].concat(platform_layout[platform].bin));
            if (!fs.existsSync(platformArg)) {
                couldNotFind(platform);
                platforms = platforms.filter(function (p) { return p != platform; });
                return;
            }
        }
        console.log("platformArg: " + cli + " " + platformArg);
        var linkPlatformsFlag = (argv.link || argv.linkplatforms) ? ' --link' : '';
        executeShellCommand(cli + ' platform add "' + platformArg + '" --verbose' + linkPlatformsFlag);
        if (platform == 'android') {
            shelljs.cp(path.join(__dirname, 'helper_files', 'android-debug-key.properties'), path.join('platforms', 'android', 'app'));
            shelljs.cp(path.join(__dirname, 'helper_files', 'android-debug-key.p12'), path.join('platforms', 'android', 'app'));
            shelljs.cp(path.join(__dirname, 'helper_files', 'build-extras.gradle'), path.join('platforms', 'android', 'app'));
        }
    });
    popd();
}

function pluginIdToDirName(id) {
    if (id.indexOf('cordova-plugin-') === 0) {
        return id;
    }

    var lastDotIndex = id.lastIndexOf('.');
    if ((lastDotIndex === -1) || (lastDotIndex === id.length - 1)) {
        return null;
    }
    return 'cordova-plugin-' + id.substr(lastDotIndex + 1);
}

////////////////////// install plugins for each platform
function installPlugins() {
    var plugins = DEFAULT_PLUGINS;

    // special override for osx platform (macOS)
    if (argv.osx) {
        if (platforms.length > 1) {
            console.warn('Warning: Testing more than one platform at once may cause issues with unsupported plugins for osx platform (macOS).');
        } else {
            console.warn('Warning: Using reduced plugin list for osx platform (macOS).');
            plugins = DEFAULT_PLUGINS_OSX;
        }
    }

    if (argv.plugins) {
        plugins = argv.plugins.split(" ").filter(function (item) {
            return item !== "";
        });
    }

    if (argv.plugman) {
        console.log("### Adding plugins using plugman...");
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
            plugins.forEach(function(plugin) {
                // plugin path must be relative and not absolute (sigh)
                executeShellCommand(nodeCommand + path.join(top_dir, "cordova-plugman", "main.js") +
                             " install --platform " + platform +
                             " --project . --plugin " + plugin +
                             " --searchpath " + top_dir);
            });

            // Install new-style test plugins
            console.log("Adding plugin tests using plugman...");
            plugins.forEach(function(plugin) {
                var pluginDirName = pluginIdToDirName(plugin);
                var potential_tests_plugin_xml = path.join(top_dir, pluginDirName, 'tests', 'plugin.xml');
                if (fs.existsSync(potential_tests_plugin_xml)) {
                    executeShellCommand(nodeCommand + path.join(top_dir, "cordova-plugman", "main.js") +
                                " install --platform " + platform +
                                " --project . --plugin " + path.dirname(potential_tests_plugin_xml));
                }
            });
            popd();
        });
    } else {

        // don't use local git repos for plugins when using --global.
        var searchPath = argv.globalplugins ? '' : top_dir;

        console.log("### Adding plugins using CLI...");
        console.log("Searchpath:", searchPath);
        pushd(cli_project_dir);

        // we do need local plugin-test-framework
        console.log("Installing local test framework plugins...");
        var linkPluginsFlag = (argv.link || argv.linkplugins) ? ' --link' : '';
        var forcePluginsFlag = (argv.forceplugins)? ' --force' : '';
        var allPluginFlags = linkPluginsFlag + variableFlag + forcePluginsFlag;

        // Install mobilespec tests only if we install default list of plugins
        // If custom list of plugins is being installed, mobilespec tests can be listed there, if needed
        if (!argv.plugins) {
            //pluginAdd('org.apache.cordova.mobilespec.tests', mobile_spec_git_dir, allPluginFlags);
        }
        //pluginAdd('org.apache.cordova.test.whitelist', mobile_spec_git_dir, allPluginFlags);
        pluginAdd('org.apache.cordova.test.echo', mobile_spec_git_dir, allPluginFlags);

        pluginAdd('cordova-plugin-test-framework', searchPath, allPluginFlags);
        pluginAdd('cordova-plugin-device', searchPath, allPluginFlags);

        if (argv.android) {
            pluginAdd('cordova-plugin-whitelist', searchPath, allPluginFlags);
        }

        plugins.forEach(function(p) {
            var sp = SEARCH_PATHS.hasOwnProperty(p) ? SEARCH_PATHS[p] : searchPath;
            pluginAdd(p, sp, allPluginFlags);
        });

        // Install new-style test plugins
        console.log("Adding plugin tests using CLI...");
        var pluginTestPaths = [];
        plugins.forEach(function(plugin) {
          var potential_tests_plugin_xml = path.join('plugins', plugin, 'tests', 'plugin.xml');
          if (fs.existsSync(potential_tests_plugin_xml)) {
            pluginTestPaths.push(path.resolve(path.dirname(potential_tests_plugin_xml)));
          }
        });
        pluginAdd(pluginTestPaths.join(' '), null, allPluginFlags);

        popd();
    }
}

////////////////////// update js files for each platform from cordova-js
function updateJS() {
    if (argv.skipjs) {
        console.log("### Skipping the js update.");
    } else if (!argv.global) {
        if (!fs.existsSync(cordova_js_git_dir)) {
            couldNotFind("js", "cordova-js");
        } else {
            console.log("### Updating js for platforms...");
            try {
                require(path.join(cordova_js_git_dir, "node_modules", "grunt"));
            } catch (e) {
                console.error("Grunt isn't installed in cordova-js, you need to:\n\trun `npm install` from: "+ cordova_js_git_dir);
            }

            platforms.forEach(function (platform) {
                var version = require(join_paths([top_dir].concat(platform_layout[platform].bin)) + '/package').version;
                pushd(cordova_js_git_dir);
                var nodeCommand = /^win/.test(process.platform) ? ("\"" + process.argv[0] + "\" ") : "";
                var code = executeShellCommand(nodeCommand + path.join(__dirname, "node_modules", "grunt-cli", "bin", "grunt") + ' compile:' + platform + ' --platformVersion=' + version).code;
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
    var scriptTimeStr = '### Script took ' + Math.round((Date.now() - startTime)/100)/10 + ' seconds';
    if (argv.plugman) {
        platforms.forEach(function (platform) {
            var projName = getProjName(platform);
            console.log("### Done. " + platform + " project created at " + path.join(top_dir, projName));
        });
        console.log(scriptTimeStr);
    } else {
        pushd(cli_project_dir);

        // Executing cordova prepare
        console.log("### Preparing project...");
        executeShellCommand(cli + " prepare");

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
