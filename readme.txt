=== BoldGrid Editor ===
Contributors: imh_brad, joemoto, rramo012, timph
Tags: inspiration,customization,build,create,design
Requires at least: 4.3
Tested up to: 4.5.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

BoldGrid Editor is a standalone plugin which adds functionality to the existing TinyMCE Editor.

== Description ==

BoldGrid Editor is a standalone plugin which adds functionality to the existing TinyMCE Editor used in the WordPress page and post editor.

== Installation ==

1. Upload the entire boldgrid-editor folder to the /wp-content/plugins/ directory.

2. Activate the plugin through the Plugins menu in WordPress.

== Changelog ==

= 1.1.4 =
* Bug fix:		JIRA WPB-1901	Fixed issue with non BG themes and gridblocks modal.
* New Feature:	JIRA WPB-1912	Adding font family and font size controls to customizer widgets.

= 1.1.3 =
* Update:		JIRA WPB-1877	Changing borders to outline for draggable objects.
* Update:		JIRA WPB-1884	Passed WordPress 4.5.1 testing.
* Bug fix:		JIRA WPB-1894	Javascript error in console after loading GridBlocks.
* Bug fix:		JIRA WPB-1895	JS Error when going to 'Google Map' tab.

= 1.1.2 =
* Bug fix:		JIRA WPB-1847	Addressing issues with drag and drop in Safari and Microsoft Edge w/ WP 4.5.

= 1.1.1.2 =
* Bug fix:		JIRA WPB-1842	Addressing issues with drag and drop in Chrome and FF w/ WP 4.5.

= 1.1.1.1 =
* Bug fix:		JIRA WPB-1816	Fixed update class interference with the Add Plugins page.

= 1.1.1 =
* Bug fix:		JIRA WPB-1809	Fixed undefined index "action" for some scenarios.  Optimized update class and addessed CodeSniffer items.

= 1.1 =
* Bug fix:      JIRA WPB-1748	Fixing flexbox issue on safari

= 1.0.9 =
* Misc:			JIRA WPB-1361	Added license file.
* New Feature:	JIRA WPB-1695	Suggest crop: Add 'size' dropdown menu when cropping an image.
* New Feature:	JIRA WPB-1698	Suggest crop: default selection should be as wide as it could be.
* New Feature:	JIRA WPB-1697	Suggest crop: Center the default selection.
* New Feature:	JIRA WPB-1528	Drag and drop enabled state is now remembered per theme.
* Update:		JIRA WPB-1696	Suggest crop: Do not trigger on 'Add Media'.
* Update:		JIRA WPB-1738	Suggest crop: Remove feature switch.

= 1.0.8 =
* New Feature:	JIRA WPB-1665	Change button opens 'Replace Image' media modal.
* New Feature:	JIRA WPB-1684	Suggest image crop when replacing images of different aspect ratios.

= 1.0.7 =
* Rework:		JIRA WPB-1616	Updated require and include statements for standards.

= 1.0.6 =
* New Feature:	JIRA WPB-1520	Serve static Gridblocks via API

= 1.0.5.1 =
* Bug fix:		JIRA WPB-1553	Fixed PHP version check condition (<5.3).

= 1.0.5 =
* New Feature:	JIRA WPB-1520	Adding Icons for draggable tools
* Usability:	JIRA WPB-1558	Improved popover hover responsiveness
* Bug fix:		JIRA WPB-1553	Added support for __DIR__ in PHP <=5.2.
* New Feature:	JIRA WPB-1026	Enable fontsize and family selection in tinymce
* New Feature:	JIRA WPB-1523	Columns will now extend to the full height of row.
* New Feature:	JIRA WPB-1332	Updating the loading graphic
* Misc:			JIRA WPB-1468	Updated readme.txt for Tested up to: 4.4.1
* New Feature:	JIRA WPB-1522   Standardize Drag Menu order
* New feature:	JIRA WPB-1557	Add wp-image-## class to images when adding gridblocks.

= 1.0.4 =
* Bug Fix:		JIRA WPB-711	Fixing compatibility issues with IE 11, 12 and 13

= 1.0.3 =
* New Feature:	JIRA WPB-1432	Added unit tests
* BugFix:		JIRA WPB-1381	Insert media will now be the default tab when changing an image
* BugFix:		JIRA WPB-1453	Fixing issue causing tinymce height to be too large to too small

= 1.0.2 =
* New feature:	JIRA WPB-1363	Updated readme.txt for WordPress standards.
* Usability:    JIRA WPB-1256   Adding cache query args for tinymce styles

= 1.0.1 =
* BUG Fix: 						Fixing error experienced in non BG themes in editor

= 1.0 =
* Initial public release.

== Upgrade Notice ==

= 1.0.1 =
Users should upgrade to version 1.0.1 to avoid issues using non-BoldGrid themes.
