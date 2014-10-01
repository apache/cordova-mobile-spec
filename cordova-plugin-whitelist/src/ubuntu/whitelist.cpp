/*
 *  Copyright 2014 Canonical Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

#include "whitelist.h"
#include <cordova_whitelist.hpp>

Whitelist::Whitelist(Cordova *cordova): CPlugin(cordova) {
}

void Whitelist::URLMatchesPatterns(int scId, int ecId, const QString &url, const QList<QString> &patterns) {
    CordovaInternal::WhiteList whitelist;
    for (const QString &pattern: patterns) {
        whitelist.addWhiteListEntry(pattern, false);
    }
    bool isAllowed = whitelist.isUrlWhiteListed(url);
    cb(scId, isAllowed);
}

void Whitelist::URLIsAllowed(int scId, int ecId, const QString &url) {
    bool isAllowed = m_cordova->config().whitelist().isUrlWhiteListed(url);
    cb(scId, isAllowed);
}
