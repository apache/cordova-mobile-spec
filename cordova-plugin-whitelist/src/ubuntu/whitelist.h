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

#ifndef WHITELIST_HKJBNNB90NM53452
#define WHITELIST_HKJBNNB90NM53452

#include <QtCore>

#include <cplugin.h>
#include <cordova.h>

class Whitelist: public CPlugin {
    Q_OBJECT
public:
    explicit Whitelist(Cordova *cordova);

    virtual const QString fullName() override {
        return Whitelist::fullID();
    }

    virtual const QString shortName() override {
        return Whitelist::fullID();
    }

    static const QString fullID() {
        return "WhitelistAPI";
    }
public slots:
    void URLMatchesPatterns(int scId, int ecId, const QString &url, const QList<QString> &patterns);
    void URLIsAllowed(int scId, int ecId, const QString &url);
};

#endif
