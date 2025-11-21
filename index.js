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

const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const { cp, rm } = require('node:fs/promises');
const path = require('node:path');
const { styleText } = require('node:util');
const inquirer = require('inquirer').default;

console.log('Welcome to the Cordova Mobile Spec Interactive Setup Tool!\n');

// MARK: Supported Platforms & Plugins

const SUPPORTED_PLATFORMS = [
    'cordova-android',
    'cordova-browser',
    'cordova-electron',
    'cordova-ios'
];

const SUPPORTED_PLUGINS = [
    'cordova-plugin-battery-status',
    'cordova-plugin-camera',
    'cordova-plugin-device',
    'cordova-plugin-device-motion',
    'cordova-plugin-device-orientation',
    'cordova-plugin-dialogs',
    'cordova-plugin-file',
    'cordova-plugin-file-transfer',
    'cordova-plugin-geolocation',
    'cordova-plugin-inappbrowser',
    'cordova-plugin-media',
    'cordova-plugin-media-capture',
    'cordova-plugin-network-information',
    'cordova-plugin-screen-orientation',
    'cordova-plugin-splashscreen',
    'cordova-plugin-statusbar',
    'cordova-plugin-vibration'
];

// MARK: Helper Methods

const print = {
    error: (message, error = '') => {
        console.error(styleText(['red', 'bold'], `\n❌  ${message}\n`), error);
        process.exit(1);
    },
    success: message => { console.log(styleText(['green', 'bold'], `\n✅  ${message}`)); },
    process: message => { console.log(styleText(['cyan', 'bold'], `\n🔵  ${message}`)); }
};

// MARK: Directory Path & Variables Setup

const projectName = 'mobilespecTestApp';

// The parent directory is the workspace containing all Cordova repositories. Including cordova-mobile-spec.
const parentDir = process.env.CORDOVA_WORKSPACE || path.join(__dirname, '..');
const projectDir = path.join(parentDir, projectName);
const projectWwwDir = path.join(projectDir, 'www');

if (existsSync(projectDir)) {
    print.error(`A mobilespec test project already exists at: ${projectDir}\n    Remove it before running 'mobilespec'.`);
}

const testFrameworkPluginDir = path.join(parentDir, 'cordova-plugin-test-framework');
if (!existsSync(testFrameworkPluginDir)) {
    print.error('Missing required plugin "cordova-plugin-test-framework"');
}

const INTERNAL_PLUGINS = [
    testFrameworkPluginDir,
    ...[
        'cordova-plugin-echo',
        'cordova-plugin-mobilespec-tests'
    ].map(p => path.join(__dirname, p)).filter(p => existsSync(p))
];

// MARK: Platform Choices & Defaults

const platformChoices = SUPPORTED_PLATFORMS.map(
    p => ({ name: p, value: p, disabled: !existsSync(path.join(parentDir, p)) })
);
if (platformChoices.filter(platform => !platform.disabled).length === 0) {
    print.error('Missing platforms. At least one platform is required for testing.');
}
// On average, more releases are performed on the Android & iOS platform.
// Additional most of the core plugins supports these platforms.
// Will default select Android & iOS based on above.
const platformDefaultChoices = platformChoices.filter(
    p => !p.disabled && ['cordova-ios', 'cordova-android'].includes(p.name)
).map(p => p.name);

// MARK: Plugin Choices & Defaults

/**
 * Determin if the plugin is disabled from interactive selection.
 * Plugins can only be tested if cloned and the "tests" directory exists.
 *
 * @param {String} plugin name. E.g. cordova-plugin-camera
 * @returns {Boolean}
 */
const isPluginDisabled = plugin => {
    return !existsSync(path.join(parentDir, plugin)) ||
        !existsSync(path.join(parentDir, plugin, 'tests')) ||
        // Temporarily disabling file-transfer plugin. Need to support running local server.
        plugin === 'cordova-plugin-file-transfer';
};
const pluginChoices = SUPPORTED_PLUGINS.map(
    p => ({ name: p, value: p, disabled: isPluginDisabled(p) })
);
if (pluginChoices.filter(platform => !platform.disabled).length === 0) {
    print.error('Missing plugins. At least one plugin is required for testing.');
}
const pluginDefaultChoices = pluginChoices.filter(p => !p.disabled).map(p => p.name);

// MARK: Interactive Prompt

/**
 * Gathers user input to determin which plugins and platforms will be instaled and tested
 *
 * @returns {Object} User answer to the questions
 */
async function gatherPackagesToInstall () {
    try {
        return await inquirer.prompt([{
            name: 'platforms',
            message: 'Select Platforms to Test:',
            type: 'checkbox',
            loop: false,
            choices: platformChoices,
            default: platformDefaultChoices
        }, {
            name: 'plugins',
            message: 'Select Plugins to Test:',
            type: 'checkbox',
            loop: false,
            choices: pluginChoices,
            default: pluginDefaultChoices
        }]);
    } catch (error) {
        if (error.name === 'ExitPromptError') {
            print.error('Cordova Mobile Spec was stopped.');
        }
    }
}

// MARK: Command Processing

/**
 * Spawns up a shell and executes command.
 *
 * @param {String} cmd Command
 * @param {Object} options Spawn Options
 * @returns {Promise}
 */
async function runCmd (cmd, options = {}) {
    options = Object.assign({}, options, { stdio: 'inherit', shell: true });
    return new Promise((resolve, reject) => {
        const [command, ...args] = cmd.split(' ');
        const process = spawn(command, args, options);
        process.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed: ${cmd}`));
            }
        });
    });
}

/**
 * Executes list of commands in sequential order.
 *
 * @param {Array<String>} commands List of commands
 * @param {Object} options Spawn options
 */
async function runCmdSequentially (commands, options) {
    try {
        for (const command of commands) {
            print.process(command);
            await runCmd(command, options);
        }
    } catch (error) {
        print.error('Failed to create mobile spec project.');
    }
}

// MARK: Main Script

(async function () {
    const { platforms, plugins } = await gatherPackagesToInstall();
    const packagesToInstall = [];

    // The user selected platforms will be added including their tests if existing.
    for (const p of platforms) {
        const platformDir = path.join(parentDir, p);
        const platformTestDir = path.join(platformDir, 'tests', 'mobilespec');
        packagesToInstall.push(`cordova platform add ${platformDir}`);
        if (existsSync(platformTestDir)) {
            packagesToInstall.push(`cordova plugin add ${platformTestDir}`);
        }
    }
    // Adding internal plugins
    for (const p of INTERNAL_PLUGINS) {
        packagesToInstall.push(`cordova plugin add ${p}`);
    }
    // The user selected plugins will be added including their tests.
    for (const p of plugins) {
        packagesToInstall.push(`cordova plugin add ${path.join(parentDir, p)}`);
        packagesToInstall.push(`cordova plugin add ${path.join(parentDir, p, 'tests')}`);
    }

    // Create Cordova App
    try {
        const createCmd = `cordova create ${projectName} org.apache.cordova.mobilespec ${projectName}`;
        print.process(createCmd);
        await runCmd(createCmd, { cwd: parentDir });
    } catch (error) {
        print.error('An error occurred while creating the mobilespec project.', error);
    }

    // Run npm install on each selected platform. "cordova.js" is needed and most platforms auto generate.
    for (const p of platforms) {
        const platformNpmInstall = 'npm install';
        print.process(`Installing npm packages for platform: ${p}.`);
        await runCmd(platformNpmInstall, { cwd: path.join(parentDir, p) });
    }

    // Replace Sample App "www" dir with "cordova-mobile-spec/www/"
    try {
        print.process('Removing the sample app\'s "www" directory.');
        await rm(projectWwwDir, { recursive: true, force: true });
        print.process('Copying the mobile-spec\'s "www" directory.');
        await cp(path.join(__dirname, 'www'), projectWwwDir, { recursive: true });
        print.process('Copying the mobile-spec\'s "config.xml" file.');
        await cp(path.join(__dirname, 'config.xml'), path.join(projectDir, 'config.xml'), { recursive: true, force: true });
    } catch (error) {
        print.error('An error occurred while trying to replace sample app\'s www with mobile-spec.', error);
    }

    // Install selected platforms and plugins
    await runCmdSequentially(packagesToInstall, { cwd: projectDir });

    // Build Cordova-Android once to ensure gradle wrapper is created
    try {
        const buildAndroid = 'cordova build android';
        print.process(buildAndroid);
        await runCmd(buildAndroid, { cwd: projectDir });
    } catch (error) {
        print.error('An error occurred while building the Android project.', error);
    }

    print.success('Successfully created and mobile spec project.');
})();
