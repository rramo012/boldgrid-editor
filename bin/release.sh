#!/usr/bin/env bash

# By Mike Jolley, based on work by Barry Kooij ;)
# License: GPL v3

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>

# ----- START EDITING HERE -----

# THE GITHUB ACCESS TOKEN, GENERATE ONE AT: https://github.com/settings/tokens
GITHUB_ACCESS_TOKEN=""

# ----- STOP EDITING HERE -----

set -e
clear

# ASK INFO
echo "--------------------------------------------"
echo "      Github to WordPress.org RELEASER      "
echo "--------------------------------------------"

# VARS
VERSION=$(git describe --exact-match --tags $(git log -n1 --pretty='%h'))
ROOT_PATH=$(pwd)"/../"
CI_BUILD_PATH=$(pwd)"/"
SVN_DIR="tmp-repo-svn"
SVN_WORKSPACE=${CI_BUILD_PATH}${SVN_DIR}

echo "Releasing Version: ${VERSION}";

# CHECKOUT SVN DIR IF NOT EXISTS
if [ ! -d $SVN_WORKSPACE ];
then
	echo "Checking out WordPress.org plugin repository"
	svn checkout $SVN_REPO $SVN_DIR --depth immediates || { echo "Unable to checkout repo."; exit 1; }
fi

# MOVE INTO SVN DIR
cd $SVN_WORKSPACE

# UPDATE SVN
echo "Updating SVN"
svn update "tags/"${VERSION} --set-depth infinity || { echo "Unable to update SVN."; exit 1; }

echo "Copy repo files to working dir"
rm -Rf $SVN_WORKSPACE"/tags/"${VERSION}
mkdir $SVN_WORKSPACE"/tags/"${VERSION}

shopt -s extglob
cp -prf ${CI_BUILD_PATH}!(node_modules|${SVN_DIR}) $SVN_WORKSPACE"/tags/"${VERSION}
shopt -u extglob

cd $SVN_WORKSPACE"/tags/"${VERSION}

# REMOVE UNWANTED FILES & FOLDERS
echo "Removing unwanted files"
rm -Rf .git
rm -Rf .github
rm -Rf tests
rm -Rf apigen
rm -Rf node_modules
rm -Rf bin
rm -Rf tools
rm -f .gitattributes
rm -f .gitignore
rm -f .gitmodules
rm -f .travis.yml
rm -f release.sh
rm -f Gruntfile.js
rm -f gulpfile.js
rm -f karma.conf.js
rm -f yarn.lock
rm -f webpack.config.js
rm -f package.json
rm -f .jscrsrc
rm -f .jshintrc
rm -f composer.json
rm -f phpunit.xml
rm -f phpunit.xml.dist
rm -f README.md
rm -f .coveralls.yml
rm -f .editorconfig
rm -f .scrutinizer.yml
rm -f apigen.neon
rm -f CHANGELOG.txt
rm -f CONTRIBUTING.md

cd $SVN_WORKSPACE

# DO THE ADD ALL NOT KNOWN FILES UNIX COMMAND
svn add --force * --auto-props --parents --depth infinity -q

# DO THE REMOVE ALL DELETED FILES UNIX COMMAND
MISSING_PATHS=$( svn status | sed -e '/^!/!d' -e 's/^!//' )

# iterate over filepaths
for MISSING_PATH in $MISSING_PATHS; do
    svn rm --force "$MISSING_PATH"
done

# DO SVN COMMIT
clear
echo "Showing SVN status"
svn status

# DEPLOY
echo ""
echo "Committing to WordPress.org...this may take a while..."
#svn commit -m "Release "${VERSION}", see readme.txt for the changelog." --username=$WP_USERNAME --password=$WP_PASSWORD --non-interactive --no-auth-cache || { echo "Unable to commit."; exit 1; }

# DONE, BYE
echo "RELEASER DONE :D"
