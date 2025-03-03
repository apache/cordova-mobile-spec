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

# Cordova Mobile Spec

This repository is used to create a Cordova testing application that verifies the core functionality and plugins of **Apache Cordova**.

Its purpose is to be executed as part of the [release process for platforms, plugins, and tools](https://github.com/apache/cordova-coho/tree/master/docs#release-processes).

It uses the [`cordova-plugin-test-framework`](https://github.com/apache/cordova-plugin-test-framework), which provides the ability for **manual and automated testing**.

_(History: A long time ago, this repository included all manual and automated plugin tests before they were extracted and moved into the respective plugins.)_

---

- [Cordova Mobile Spec](#cordova-mobile-spec)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
    - [Setting Up a Cordova Workspace](#setting-up-a-cordova-workspace)
    - [Installing Interactive CLI Dependencies](#installing-interactive-cli-dependencies)
    - [Global Command Support (Optional)](#global-command-support-optional)
  - [Usage](#usage)

---

## Overview

This repository contains the following:

1. **Template for the Cordova testing app**

    - **`config.xml`**

      The configuration file for the testing application.

    - **`www`**

      This folder contains:

      - A web-based UI template for the testing application.
      - Pages for manually testing various Cordova functionalities.
      - Benchmarks and links for triggering manual and automated tests.

      The preconfigured Cordova functionalities include:

      - Battery
      - Events
      - Keyboard
      - LazyloadJS
      - SQL
      - Storage
      - Miscellaneous features

2. **`cordova-plugin-echo` (Internal Plugin)**

   A simple echo function implemented for testing the Cordova bridge.

3. **`cordova-plugin-mobilespec-tests` (Internal Plugin)**

   Contains non-plugin automated tests for Cordova.

4. **Interactive CLI Setup Tool**

   The main tool used to automatically create and configure the Mobile Spec application.

## Prerequisites

### Setting Up a Cordova Workspace

You should already have a workspace that contains all Cordova repositories. It is **RECOMMENDED** to use `cordova-coho` to set up your workspace, as it will automatically clone all necessary repositories.

You can also manually set up a workspace, but for this tool to work, the following criteria **MUST** be met:

1. The Cordova workspace directory **MUST** contain at least **one or more active Apache Cordova core plugins**.
2. The Cordova workspace directory **MUST** contain at least **one or more active Apache Cordova core platforms**.
3. The Cordova workspace directory **MUST** contain `cordova-plugin-test-framework`.
4. It is **RECOMMENDED** that the Cordova workspace directory contains the `cordova-mobile-spec` repository.

    - If `cordova-mobile-spec` is inside the Cordova workspace, the interactive CLI tool will automatically detect the other repositories in the parent directory.
    - If `cordova-mobile-spec` is located elsewhere, you **MUST** specify the workspace path using the `CORDOVA_WORKSPACE` environment variable when running the interactive CLI.

### Installing Interactive CLI Dependencies

Run the following command in the root directory of `cordova-mobile-spec`:

```bash
npm install
```

### Global Command Support (Optional)

To enable the `mobilespec` command to run from any directory, run the following command in the root directory of `cordova-mobile-spec`:

```bash
npm link
```

> **Note:** The app created when running the `mobilespec` command will be generated in the Cordova workspace.

## Usage

Once the prerequisites are met, you can launch the interactive CLI tool from the Cordova workspace directory.

If **Global Command Support** was configured:

```bash
mobilespec
```

Or, without global installation:

```bash
npx ./cordova-mobile-spec
```
