

::!/bin/bash

:: Licensed to the Apache Software Foundation (ASF) under one
:: or more contributor license agreements.  See the NOTICE file
:: distributed with this work for additional information
:: regarding copyright ownership.  The ASF licenses this file
:: to you under the Apache License, Version 2.0 (the
:: "License"); you may not use this file except in compliance
:: with the License.  You may obtain a copy of the License at
::
::   http://www.apache.org/licenses/LICENSE-2.0
::
:: Unless required by applicable law or agreed to in writing,
:: software distributed under the License is distributed on an
:: "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
:: KIND, either express or implied.  See the License for the
:: specific language governing permissions and limitations
:: under the License.
:: Windows command line script for Mobile spec tests
:: Description:
:: Script creates a mobilespec project that uses all local repositories.
:: Based on: https://wiki.apache.org/cordova/WorkingWithThree#
:: but with some other capabilities.
:: Basically is a command line script file (With a little of VBS), 
:: that uses the Cordova Command Line Interface, git for windows, 
:: and node cordova-cli module to create and assist the test process,
:: using cordova mobile specs test suite, that includes manual and automated tests, 
:: to test plugins capabilities, as well as stability through versions.
:: The script capabilities helps to simplify the test process, obtaining
:: all resources required or giving the chance to set them in place, or set where they are.
::This script file it uses the cordova CLI capabilities to create, 
:: add platforms/plugins, as well as build, emulate and deploy to phone,
:: it also uses the coho script to update some repositories, and get several resources if it's required.

:: Requirements:
:: -Git for windows installed (http://git-scm.com/download/win)
:: -Node.js (http://nodejs.org/).
:: Basically it requires the correct environment for each platform,
:: therefore, if you don't already have the environment for that platform that
:: you need to test, start set it up, path's JDKs, and every resource required.
:: there's a lot of information at Apache Cordova Documentation web site [http://cordova.apache.org/docs/en/3.3.0/index.html]
:: In order to use this batch script, just follow the set of instructions provided
:: during the execution.

@ECHO OFF
FOR /f "Tokens=1-4 Delims=/ " %%i IN ('date /t') DO SET dt=%%l%%j%%k
FOR /f "Tokens=1" %%i in ('time /t') DO SET tm=%%i
::timestamp (yyyymmmdd-hhnnss)
SET tm=%tm::=%%time:~-5,2%
SET dttm=%dt%_%tm%

::CREATING VBS
> %TEMP%\BrowseFolder.vbs ( 
ECHO SET rundll32Object = CreateObject^( "Shell.Application" ^) 
ECHO DO
ECHO   SET pathObject = rundll32Object.BrowseForFolder^(0, "Select Folder", ^&H0001,0^) 
ECHO   IF pathObject Is Nothing Then
ECHO     wscript.ECHO "INVALID"
ECHO     wscript.quit
ECHO   ELSE
ECHO     wscript.ECHO pathObject.self.Path
ECHO     wscript.quit
ECHO   END IF
ECHO LOOP
) 

ECHO         _______________ Deploying Mobile Spec Test ____________________
date /t
time /t
SET GETCURRENTDIR="%cd%"
::Check GIT installation.

ECHO _____ Checking GIT program in environment ...
VERIFY >NUL
CALL GIT --version 2>NUL
IF %ERRORLEVEL% EQU 0 (
						ECHO ______Git is present in the environment	
						GOTO CHECKCOHO
						)
IF %ERRORLEVEL% EQU 9009 ECHO ______ Git path not found at Path environmental variable
ECHO.
ECHO _____ Searching path from previous execution ...
IF EXIST %TEMP%\gitenvpath.txt (
								SET /p GITPATH=<%TEMP%\gitenvpath.txt
								ECHO ______ Git path from previous execution %GITPATH%
								IF EXIST %GITPATH%\git.exe GOTO SETGITHPATH_NW
								)
ECHO ______ Invalid git path from previous execution
ECHO _____ Checking GIT under default paths ...
SET GITPATH="%PROGRAMFILES%\git\cmd"
IF EXIST %GITPATH%\git.exe GOTO SETGITPATH
ECHO ______ GIT not found in %GITPATH%

SET GITPATH="%PROGRAMFILES(X86)%\git\cmd"
IF EXIST %GITPATH%\git.exe GOTO SETGITPATH

:ENTER_PATH
ECHO _____ GIT not found in %GITPATH%, neither in environment
ECHO ______ Please, provide Git installation path to continue
SET GITPATH=INVALID
FOR /f "tokens=*" %%a in ('cscript //nologo "%temp%\BrowseFolder.vbs"') DO SET GITPATH=%%a 
SET GITPATH=%GITPATH:~0,-1%
SET GITPATH="%GITPATH%"
ECHO %GITPATH%
IF EXIST %GITPATH%\git.exe GOTO SETGITPATH
ECHO ______ Invalid path, there was an error or you have cancelled ...
ECHO ______ Install Git, before another try out!!
GOTO END

:SETGITPATH
::SET PATH VARIABLE FOR GIT, THIS PATH VARIABLE IT WILL ONLY WORK FOR THE CURRENT COMMAND LINE SESSION, IT'S NOT PERMANENTLY.
ECHO ______ Writing file path for future executions
> %TEMP%\gitenvpath.txt (
ECHO %GITPATH%
						)
:SETGITHPATH_NW
ECHO _____ GIT found in %GITPATH%

SET PATH=%PATH%;%GITPATH%

:CHECKCOHO
::CHECK COHO
CD ..
SET BASEDIR=%CD%
IF NOT EXIST %BASEDIR%\coho.cmd GOTO GETCOHO
ECHO.
ECHO.
ECHO.
ECHO ________________________________________________________________________________
ECHO _____ Cordova-Coho repository available on %BASEDIR%
CHOICE /M "Would you like to update Cordova-Coho Repository?" /c YN
IF %ERRORLEVEL% EQU 2 GOTO CHECK_JS
ECHO _____ Checking for repository updates ...
:: CHECKING FOR UPDATES FOR CORDOVA-COHO
CALL npm install
CALL COHO repo-update -r auto
ECHO _____ Done !!
GOTO CHECK_JS

:GETCOHO

ECHO _____ Cordova-Coho repository not available 
ECHO _____ Please, select Cordova-Coho download path
set COHOPATH=INVALID
for /f "tokens=*" %%a in ('cscript //nologo "%temp%\BrowseFolder.vbs"') do set COHOPATH=%%a 
SET COHOPATH=%COHOPATH:~0,-1%
IF "%COHOPATH%" EQU "INVALID" (
							ECHO _____ Invalid path ...
							PAUSE
							GOTO END
							)
CD "%COHOPATH%"
CALL git clone https://git-wip-us.apache.org/repos/asf/cordova-coho.git
CD cordova-coho
SET BASEDIR=%CD%
CALL npm install
CALL coho repo-clone -r plugins -r mobile-spec -r android -r blackberry -r windows -r wp8 -r cli -r js
ECHO.
ECHO.
ECHO.
ECHO ________________________________________________________________________________
ECHO _____ Now your workspace it will be %BASEDIR%
CHOICE /M "Would you like to copy the mobileSpec_Test_Windows.bat file to %BASEDIR%\cordova-mobile-spec?" /c YN
IF %ERRORLEVEL% EQU 1 (
						copy %GETCURRENTDIR%\mobileSpec_Test_Windows.bat /y %BASEDIR%\cordova-mobile-spec
						)

:CHECK_JS

ECHO _____ Looking for cordova-js under %BASEDIR%
IF NOT EXIST %BASEDIR%\cordova-js GOTO FAILJS
ECHO.
ECHO.
ECHO.
ECHO ________________________________________________________________________________
ECHO _____ Found cordova-js under %BASEDIR%..
CHOICE /M "Would you like to update your cordova-js repository?" /c YN
IF %ERRORLEVEL% EQU 2 GOTO GRUNT_CORDOVA
ECHO _____ Updating cordova-js repository
CALL coho repo-update -r js
GOTO GRUNT_CORDOVA

:FAILSJS
CALL coho repo-clone -r js
ECHO _____ Cordova-js cloned

:GRUNT_CORDOVA
ECHO.
ECHO.
ECHO.
ECHO ________________________________________________________________________________
CHOICE /M "Do you have Grunt module Installed? [Press N to Install] [Press Y to continue] ..." /c YN
IF %ERRORLEVEL% EQU 1 GOTO CALL_GRUNT_FUNC
CALL npm install -g grunt-cli
:CALL_GRUNT_FUNC
CD %BASEDIR%\cordova-js
CALL npm install
CALL grunt
CD %BASEDIR%

:CHECK_MS
ECHO _____ Checking Directories
ECHO %BASEDIR%
IF NOT EXIST %BASEDIR%\cordova-mobile-spec GOTO CMSNotFound 
ECHO _____ FOUND cordova-mobile-spec DIRECTORY
IF EXIST "%BASEDIR%"\mobilespec GOTO MSDirFound

:ENDMSCHECK

SET sel=null
CALL cordova create mobilespec org.apache.mobilespec.tests MobileSpec
CD mobilespec
:MENUPLATFORMS
::READY TO START TO WORK WITH THE PROJECT
CLS			
ECHO             ____________ Platforms ____________
ECHO             ___ Select Platform to add: ____________
ECHO             ______ A)  Android
ECHO             ______ BB) Blackberry10
ECHO             ______ WP) Windows Phone 8
ECHO             ______ W8) Windows 8
ECHO             ______ F)  Finish
ECHO             ______ E)  Exit

SET /p option=Enter choice:

IF "%option%" EQU "A" (
					SET sel=android
					SET available[0]=%sel%
					GOTO ADDPLATFORM
					)
IF "%option%" EQU "BB" (
					SET sel=blackberry10
					SET available[1]=%sel%
					GOTO ADDPLATFORM
					)
IF "%option%" EQU "WP" (
					SET sel=wp8
					SET available[2]=%sel%
					GOTO ADDPLATFORM
					)
IF "%option%" EQU "W8" (
					SET sel=windows8
					SET available[3]=%sel%
					GOTO ADDPLATFORM
					)
IF "%option%" EQU "F" GOTO CHECK_NOT_NULL
IF "%option%" EQU "E" GOTO END

:INVALIDCHOICE
ECHO _____ Invalid choice, try again or type E to terminate the program
PAUSE
GOTO MENUPLATFORMS

:NULLCHOICE
ECHO _____ You have to add at least one platform to continue.
PAUSE
GOTO MENUPLATFORMS

:CHECK_NOT_NULL
IF "%sel%"=="null" GOTO NULLCHOICE
GOTO ADDING_PLUGINS

:ADDPLATFORM
ECHO _____ Adding %sel%
CALL cordova platform add %sel%
ECHO _____ Added %sel% Platform to the project
PAUSE
GOTO MENUPLATFORMS
:ADDING_PLUGINS
CLS
ECHO             ____________ Plugins ____________
ECHO             ___ Select option:
ECHO             ______ A) Add all plugins from Cordova-Coho
ECHO             ______ P) Add a Custom plugin
ECHO             ______ C) Do not add plugins, just continue to prepare project
CHOICE /M "Enter selection: " /c APC
IF %ERRORLEVEL% EQU 1 GOTO ALLPLUGINS
IF %ERRORLEVEL% EQU 2 GOTO SINGLEPLUGIN
IF %ERRORLEVEL% EQU 3 GOTO BUILDALL

ECHO _____ ERROR, please select one of the listed options
PAUSE
GOTO ADDING_PLUGINS

:SINGLEPLUGIN

ECHO ____________ Add single plugin: ____________
ECHO ___ Enter plugin package and location path
ECHO ___ Select plugin location path...
PAUSE
SET pluginpath=INVALID 
FOR /f "tokens=*" %%a IN ('cscript //nologo "%temp%\BrowseFolder.vbs"') DO SET pluginpath=%%a 
SET pluginpath=%pluginpath:~0,-1%
IF "%pluginpath%" EQU "INVALID" (
							ECHO _____ Invalid path ...
							PAUSE
							GOTO ADDING_PLUGINS
							)
ECHO _____ Looking for plugin.xml file ....
IF NOT EXIST "%pluginpath%"\plugin.xml (
								ECHO _____ plugin.xml file is missing, invalid path
								PAUSE
								GOTO ADDING_PLUGINS
								)
								
ECHO _____ plugin.xml found in "%pluginpath%"
ECHO _____ Looking for package ID ...
SET plugin=NULL 

 > %temp%\xmlAnalize.vbs (
ECHO DIM xmlFile
ECHO Set xmlFile= CreateObject^( "Microsoft.XMLDOM" ^) 
ECHO xmlFile.Load "%pluginpath%\plugin.xml"
ECHO DIM pluginId
ECHO set pluginId= xmlFile.selectSingleNode^( "//plugin" ^)
ECHO IF pluginId is nothing then
ECHO wscript.echo NULL
ECHO END IF
ECHO wscript.echo pluginId.getAttribute^( "id" ^)
)
FOR /f "tokens=*" %%a IN ('cscript //nologo "%temp%\xmlAnalize.vbs"') DO SET plugin=%%a 
SET plugin=%plugin:~0,-1%
IF "%plugin%" EQU "NULL" ( 
  ECHO _____ No plugin information found at "%pluginpath%"\plugin.xml
  ECHO _____ Plugin it won't be added
  GOTO ADDING_PLUGINS
) ELSE (
ECHO [Plugin package]: "%plugin%"
ECHO [Plugin Path]: "%pluginpath%"
)
PAUSE 
ECHO _____ Adding "%plugin%" from "%pluginpath%" to project 
CALL cordova plugin add "%plugin%" --searchpath "%pluginpath%"
:MOREPLUGINS
CHOICE /M "Do you want to add another plugin? (Y / N)" /c YN
IF %ERRORLEVEL% EQU 1 GOTO SINGLEPLUGIN
GOTO TRANSFER_DATA

:ALLPLUGINS
ECHO _____ Adding all updated plugins from Cordova-Coho 
CALL cordova plugin add ..\cordova-mobile-spec\dependencies-plugin --searchpath "%BASEDIR%"
::CALL plugman install --platform android --project %BASEDIR%\mobilespec\platforms\android --plugin %BASEDIR%\cordova-mobile-spec\dependencies-plugin --searchpath "%BASEDIR%"
PAUSE
:PREBUILD
CLS
ECHO  __________________________________________________
ECHO        Do you want to add a single plugin?
ECHO         This is useful for testing local
ECHO         changes of a plugin, and test it
ECHO		 with the whole set of plugins
ECHO  __________________________________________________
CHOICE /M "Enter choice: " /c YN
IF %ERRORLEVEL% EQU 1 GOTO SINGLEPLUGIN
:TRANSFER_DATA
CLS
ECHO _____ Now all the required data it will be transfered to the www folder
PAUSE
ECHO _____ Transfering data to www folder 
xcopy %BASEDIR%\cordova-mobile-spec\*.* /f /s /e /y %BASEDIR%\mobilespec\www
ECHO _____ Transfer Complete !!
PAUSE
CLS
ECHO             __________________________________________________
ECHO             Everything set to build, if you want to continue 
ECHO             and prepare all platforms [Press C], if want to 
ECHO             open the explorer and customize the project [Press P].
ECHO             __________________________________________________
CHOICE /M "Continue [Press C], Customize project [Press P]?" /c CP

IF %ERRORLEVEL% EQU 1 GOTO PREPARE
ECHO _____ Launching Project explorer window
explorer.exe %BASEDIR%\mobilespec

ECHO _____ Customize your project, then press any key to build
PAUSE

:PREPARE
ECHO _____ Preparing all added platforms...
CALL cordova prepare
PAUSE

:MENUS

CLS
ECHO __________________________________________________
ECHO      The project is ready to test, where do you
ECHO      want to test it?
ECHO __________________________________________________
ECHO _____________ Select where you want to deploy it:
ECHO ________________  P) Phone
ECHO ________________  E) Phone Emulator
ECHO ________________  F) Finish Program
CHOICE /M "Enter choice:" /c PEF

IF %ERRORLEVEL% EQU 1 GOTO MENU_DEPLOY_PHONE
IF %ERRORLEVEL% EQU 2 GOTO MENU_EMULATE
IF %ERRORLEVEL% EQU 3 GOTO END


:MENU_EMULATE
::READY TO DEPLOY, MAKE SURE THAT YOU HAVE THE EMULATOR OPEN AND RUNNING
set emu=null
CLS
ECHO             __________________________________________________
ECHO                  You have to start the right emulator for 
ECHO                  the platform(Except for WP8 and Windows 8)
ECHO                  that you are trying to test. 
ECHO             __________________________________________________

ECHO _____________ Select Platform to Deploy into Emulator:
IF "%available[0]%" NEQ "" ECHO ________________ A)  Deploy Android Project
IF "%available[1]%" NEQ "" ECHO ________________ BB) Deploy Blackberry10 Project
IF "%available[2]%" NEQ "" ECHO ________________ WP) Deploy Windows Phone 8 Project
IF "%available[3]%" NEQ "" ECHO ________________ W8) Deploy Windows 8 Project
ECHO ________________ P)  Add another platform
ECHO ________________ PL) Add plugins
ECHO ________________ DP) Deploy to Phone Menu
ECHO ________________ E)  Exit
SET /p option= Type Option:

IF "%option%" EQU "A" (
					SET emu=android 
					GOTO DEPLOY_PLATFORM
					)
IF "%option%" EQU "BB" (
					SET emu=blackberry10
					GOTO DEPLOY_PLATFORM
					)
IF "%option%" EQU "WP" (
					SET emu=wp8
					GOTO DEPLOY_WP_PLATFORM
					)
IF "%option%" EQU "W8" (
					SET emu=windows8
					GOTO DEPLOY_PLATFORM
					)
IF "%option%" EQU "P" GOTO MENUPLATFORMS
IF "%option%" EQU "PL" GOTO ADDING_PLUGINS
IF "%option%" EQU "DP" GOTO MENU_DEPLOY_PHONE
IF "%option%" EQU "E" GOTO END

:INVALID_EMULATE_CHOICE
ECHO _____ Invalid choice, try again or type E to terminate the program
PAUSE
GOTO MENU_EMULATE

:DEPLOY_PLATFORM
SET emu=%emu: =%
ECHO _____ Transfering js file from Cordova-JS folder
copy %BASEDIR%\cordova-js\pkg\cordova.%emu%.js /y %BASEDIR%\mobilespec\platforms\%emu%\platform_www\cordova.js
ECHO _____ Building %emu% platform...
CALL cordova build %emu%
ECHO _____ Emulating %emu%
CALL cordova emulate %emu%
PAUSE

GOTO MENU_EMULATE

:DEPLOY_WP_PLATFORM
SET xap_path="C:\Program Files (x86)\Microsoft SDKs\Windows Phone\v8.0\Tools\XAP Deployment"
ECHO _____ XAP Deployment default location: %xap_path%

:CHECK_XAP_FILES
ECHO _____ Check for XapDeploy.exe ...
IF NOT EXIST %xap_path%\XapDeploy.exe (
									    ECHO _____ XapDeploy.exe file not found at %xap_path%
										GOTO ENTER_XAP_PATH
										)
ECHO _____ XapDeploy.exe found at %xap_path%
ECHO _____ Check for XapDeployCmd.exe ...
IF NOT EXIST %xap_path%\XapDeployCmd.exe (
									    ECHO _____ XapDeployCmd.exe file not found at %xap_path%
										GOTO ENTER_XAP_PATH
										)
ECHO _____ XapDeployCmd.exe found at %xap_path%
ECHO _____ Check for XapDeployDll.dll ...
IF NOT EXIST %xap_path%\XapDeployDll.dll (
									    ECHO _____ XapDeployDll.dll file not found at %xap_path%
										GOTO LAUNCH_WP_EMULATOR
										)
ECHO _____ XapDeployDll.exe found at %xap_path%
GOTO LAUNCH_WP_EMULATOR
:ENTER_XAP_PATH
set xap_path=INVALID 
for /f "tokens=*" %%a in ('cscript //nologo "%temp%\BrowseFolder.vbs"') do set xap_path=%%a 
IF %xap_path% EQU "INVALID" (
							ECHO _____ Invalid path ...
							PAUSE
							GOTO MENU_EMULATE
							)
GOTO CHECK_XAP_FILES

:LAUNCH_WP_EMULATOR
SET emu=%emu: =%
ECHO _____ Transfering js file from Cordova-JS folder
copy %BASEDIR%\cordova-js\pkg\cordova.windowsphone.js /y %BASEDIR%\mobilespec\platforms\%emu%\platform_www\cordova.js
ECHO _____ Building %emu% platform...
CALL cordova build %emu%
:: WHY CALLING DIRECTLY TO THE EXECUTABLE FILE?, WELL THAT'S BECAUSE CALLING IT USING CORDOVA EMULATE WP8, IT DOESN'T RELEASE THE THREAD,
:: MEANING THAT IT WON'T BE POSSIBLE TO DEPLOY TO ANOTHER PLATFORM OR ANY OTHER OPTION, UNTIL YOU CLOSE THE WINDOWS PHONE EMULATOR.

ECHO _____ Launching Windows Phone Emulator for %BASEDIR%\mobilespec\platforms\wp8\Bin\Debug\CordovaAppProj_Debug_AnyCPU.xap with default Device 
CALL %xap_path%\XapDeployCmd.exe /installlaunch %BASEDIR%\mobilespec\platforms\wp8\Bin\Debug\CordovaAppProj_Debug_AnyCPU.xap /targetdevice:xd
ECHO _____ Done !!
PAUSE
GOTO MENU_EMULATE


:MENU_DEPLOY_PHONE
::READY TO DEPLOY INTO PHYSICAL PHONE, MAKE SURE THAT YOU HAVE THE PHONE PLUGGED, WITH THE USB DEBUGGING ACTIVATED AND READY
set dep=null
CLS
ECHO           __________________________________________________
ECHO                 Make sure that you have your phone 
ECHO                 plugged and USB Debugging activated
ECHO           __________________________________________________

ECHO _____________ Select the Phone to Deploy : 
IF "%available[0]%" NEQ "" ECHO ________________ A)   Deploy Project to Android Phone
IF "%available[1]%" NEQ "" ECHO ________________ BB)  Deploy Project to Blackberry10 Phone
IF "%available[2]%" NEQ "" ECHO ________________ WP)  Deploy Project to Windows Phone 8
IF "%available[3]%" NEQ "" ECHO ________________ W8)  Deploy Project to Windows 8
ECHO ________________ P)  Add another platform
ECHO ________________ PL) Add plugins
ECHO ________________ EM) Go to Menu Emulator
ECHO ________________ E)  Exit
SET /p option= Type Option:

IF "%option%" EQU "A" (
					SET dep=android 
					GOTO DEPLOY_PHONE
					)
IF "%option%" EQU "BB" (
					SET dep=blackberry10
					GOTO DEPLOY_PHONE
					)
IF "%option%" EQU "WP" (
					SET dep=wp8
					GOTO DEPLOY_WP_PHONE
					)
IF "%option%" EQU "W8" (
					SET dep=windows8
					GOTO DEPLOY_PHONE
					)
IF "%option%" EQU "P" GOTO MENUPLATFORMS
IF "%option%" EQU "PL" GOTO ADDING_PLUGINS
IF "%option%" EQU "EM" GOTO MENU_EMULATE
IF "%option%" EQU "E" GOTO END

:INVALID_DEPLOY_CHOICE
ECHO _____ INVALID DEPLOY OPTION, TRY AGAIN
GOTO MENU_DEPLOY_PHONE

:DEPLOY_PHONE
SET dep=%dep: =%
ECHO _____ Transfering js file from Cordova-JS folder
copy %BASEDIR%\cordova-js\pkg\cordova.%dep%.js /y %BASEDIR%\mobilespec\platforms\%dep%\platform_www\cordova.js
ECHO _____ Building %dep% platform...
CALL cordova build %dep%
ECHO _____ Deploying %dep%
CALL cordova run %dep%
PAUSE
GOTO MENU_DEPLOY_PHONE


:MSDirFound
ECHO.
ECHO.
ECHO.
ECHO ________________________________________________________________________________
ECHO _____ FOUND mobilespec DIRECTORY
CHOICE /M "Do you want to delete the current *mobilespec* project?" /c YN

IF %ERRORLEVEL% EQU 1 GOTO MSDel
ECHO _____ The program cannot continue, DELETE mobilespec directory and re-execute
GOTO END

:MSDel
RD /s /q mobilespec
ECHO _____ mobilespec DIRECTORY DELETED 
PAUSE
GOTO ENDMSCHECK

:CMSNotFound
ECHO _____ Please run this script from the directory that contains cordova-mobile-spec
GOTO END

:END

ECHO _____ PROGRAM TERMINATED 
PAUSE
