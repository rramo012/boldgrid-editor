[![Build Status](https://travis-ci.org/BoldGrid/boldgrid-editor.svg?branch=master)](https://travis-ci.org/BoldGrid/boldgrid-editor)
[![License](https://img.shields.io/badge/license-GPL--2.0%2B-orange.svg)](https://raw.githubusercontent.com/BoldGrid/boldgrid-editor/master/LICENSE)
[![PHP Version](https://img.shields.io/badge/PHP-5.3%2B-blue.svg)](https://php.net)
[![Code Climate](https://codeclimate.com/github/BoldGrid/boldgrid-editor/badges/gpa.svg)](https://codeclimate.com/github/BoldGrid/boldgrid-editor)

# BoldGrid Editor #
**Contributors:** rramo012, imh_brad, timph, joemoto

**Tags:** drag and drop, tinymce, editor

**Requires at least:** 4.4

**Tested up to:** 4.8.1

**License:** GPLv2 or later

**License URI:** http://www.gnu.org/licenses/gpl-2.0.html

BoldGrid Editor is a standalone plugin which adds functionality to the existing TinyMCE Editor.

## Description ##

BoldGrid Editor is a standalone plugin which adds functionality to the existing TinyMCE Editor used in the WordPress page and post editor.

## Requirements ##

* PHP 5.3 or higher.

## Installation ##

1. Upload the entire boldgrid-editor folder to the /wp-content/plugins/ directory.

2. Activate the plugin through the Plugins menu in WordPress.

## JS/CSS Development ##

```
# Install dependencies
yarn install

# Run localhost:4000 with hot reload
npm start

# Add the following to your wp-config.php
define( 'SCRIPT_DEBUG', true );
define( 'BGEDITOR_SCRIPT_DEBUG', true );

# Build for production
yarn build
```
