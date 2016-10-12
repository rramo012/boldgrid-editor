=== BoldGrid Editor ===
Contributors: imh_brad, joemoto, rramo012, timph
Tags: inspiration,customization,build,create,design
Requires at least: 4.3
Tested up to: 4.6.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

BoldGrid Editor is a standalone plugin which adds functionality to the existing TinyMCE Editor.

== Description ==

BoldGrid Editor is a standalone plugin which adds functionality to the existing TinyMCE Editor used in the WordPress page and post editor.

== Installation ==

1. Upload the entire boldgrid-editor folder to the /wp-content/plugins/ directory.

2. Activate the plugin through the Plugins menu in WordPress.

== Changelog ==

= 1.3 =
* Update:		JIRA WPB-2541	Added neutral colors to section background colors.
* Update:		JIRA WPB-2542	Removed duplicate maps types.
* Update:		JIRA WPB-2543	Added Google maps edit link.
* Update:		JIRA WPB-2532	Updating Dependencies.
* Bug Fix:		JIRA WPB-2540	Fixed issue with text color and section backgrounds.
* Bug Fix:		JIRA WPB-2533	Fixing issue with update notice blocking user interaction on loading failure.

= 1.2.13 =
* Update:		JIRA WPB-2522	Fixing panel issue after first time notice.

= 1.2.12 =
* Update:		JIRA WPB-2489	Added update notice for users updating to 1.3.
* Update:		JIRA WPB-2479	Adding a conversion method from static maps to embed maps.
* Bug Fix:		JIRA WPB-2456	Allow users to drag into empty sections.
* Bug Fix:		JIRA WPB-2494	Fixed issue with system fonts used in themes.

= 1.2.11 =
* Bug Fix:		JIRA WPB-2470	Fixing issue with popover panel items.

= 1.2.10 =
* Update:		JIRA WPB-2456	Smoothing auto scroll during drag.
* Update:		JIRA WPB-2453	Hide popover font control when not applicable.
* Update:		JIRA WPB-2440	Setting default text color for column backgrounds.
* Update:       JIRA WPB-2065   Added default to font selection.
* Update:       JIRA WPB-2461   Add Media now in Drop Tab > Add new.
* Bug Fix:		JIRA WPB-2448	Fixing issue with column popover at the edge of the screen.
* Bug Fix:		JIRA WPB-2457	Fixing z-index issue withe section popover.
* Bug Fix:		JIRA WPB-2454	Image being cloned after pressing enter.
* Bug Fix:		JIRA WPB-2442	Nested columns allowed for parent column backgrounds.
* Bug Fix:      JIRA WPB-2441   Fixing issue with row resize cursor.
* Bug Fix:      JIRA WPB-2447   Hide button color if multiple buttons in a paragraph.
* Bug Fix:      JIRA WPB-2455   Staging colors and buttons will now be enqueued correctly.
* Update:		JIRA WBP-2426	Adjust the way crop modal hides router tabs.

= 1.2.9 =
* Bug Fix:		JIRA WPB-2428	Added cache busting for colors and button files.

= 1.2.8 =
* Misc:			JIRA WPB-2420	Added EOF line breaks.
* Update:		JIRA WPB-2407	Fix issue with direction of section popover menu.
* Bug Fix:		JIRA WPB-2405	Fixed issue where section border did not show.
* Bug Fix:		JIRA WPB-2408	Fixed issue where change icon does not appear.
* Bug Fix:		JIRA WPB-2409	Fixed issue causing missing image toolbar.
* Bug Fix:		JIRA WPB-2405	Fixed issue causing button customization to disappear.
* Bug Fix:		JIRA WPB-2405	Reset class controls when opening customizer.
* New feature:	JIRA WPB-2414	Change image added to BG menu bar.
* New feature:	JIRA WPB-2406	Add my button designs to button panel.
* New feature:	JIRA WPB-2406	Track my designs for images as the user makes changes.
* New feature:	JIRA WPB-2415	Add Button Primary & Button Secondary to Button Panel.
* Bug Fix:		JIRA WPB-2400	Wrapping content elements not contained, in theme default containers.

= 1.2.7 =
* Misc:			JIRA WPB-2344	Updated readme.txt for Tested up to 4.6.1.
* Bug fix:		JIRA WPB-2336	Load BoldGrid settings from the correct WP option (site/blog).
* Update:		JIRA WPB-2368	Setting version constant from plugin file.
* New feature:  JIRA WPB-2065   Buttons, Fonts and text backgrounds will now track usage on other pages.
* Update:       JIRA WPB-2065   Appearance of drag element has been modified.
* New feature:  JIRA WPB-2065   Added Section dragging & zoomed out view.

= 1.2.6 =
* Bug fix:		JIRA WPB-2065	Rebuilding JS assets.

= 1.2.5 =
* Bug fix:		JIRA WPB-2325	Added wrapper to handle mb_convert_encoding() if mbstring is not loaded.
* Bug fix:		JIRA WPB-2065	Issue where popovers did not comeback after drag drop.
* New feature:	JIRA WPB-2065	Overlays color for background images.
* New feature:	JIRA WPB-2065	Added column dragging to empty areas within row.
* New feature:	JIRA WPB-2065	Added column resizing from first column on the left boundary.
* New feature:	JIRA WPB-2065	Empty columns will be automatically deleted while resizing within a row.
* New feature:	JIRA WPB-2065	Added border color control to boxes.
* New feature:	JIRA WPB-2065	Row resizing now works in nested rows.
* New feature:	JIRA WPB-2065	Add theme section fonts to font selection.
* New feature:	JIRA WPB-2065	Added customization options for gradients.
* Bug fix:		JIRA WPB-2065	Bug fixes for towards undo and redo actions.
* Bug fix:		JIRA WPB-2065	Fixed issues with tripple click to delete.
* Bug fix:		JIRA WPB-2065	Fixed issues with editor height.
* Bug fix:		JIRA WPB-2065	Fixed issues with color control preselecting.

= 1.2.4 =
* Bug fix:		JIRA WPB-2272	Fixing issue with default container class.
* Bug fix:		JIRA WPB-2271	Fixing JS error when gallery plugin is missing.
* Bug fix:		JIRA WPB-2273	Fixing issue breaking font family selection.

= 1.2.3 =
* Misc:			JIRA WPB-2256	Updated readme.txt for Tested up to: 4.6.
* New feature:	JIRA WPB-2065	Added customiztion of Icons.
* New feature:	JIRA WPB-2065	Added customiztion of Backgrounds.
* New feature:	JIRA WPB-2065	Added customiztion for widths of rows.
* New feature:	JIRA WPB-2065	Added customiztion for padding on rows.
* New feature:	JIRA WPB-2065	Added customiztion of Buttons.
* New feature:	JIRA WPB-2065	Added customiztion of Fonts.
* New feature:	JIRA WPB-2065	Introduced customization and new component "Text Backgrounds".
* New feature:	JIRA WPB-2065	Users can now add border to images.
* New feature:	JIRA WPB-2065	Users can now apply filters to images.
* Rework:		JIRA WPB-1825	Formatting.

= 1.2.2 =
* Bug fix:		JIRA WPB-2175	Issue causing parent row to be deleted when removing icon or anchor.

= 1.2.1 =
* Bug fix:		JIRA WPB-2146	Issue with pressing enter on an empty .row > .column.
* Bug fix:		JIRA WPB-2149	Fixed issue with gridblocks getting images updated.

= 1.2 =
* Bug fix:		JIRA WPB-2126	Fixing issue with column popover size when zooming out.
* Bug fix:		JIRA WPB-2103	Sporadic issue, images load but then disappear within editor.

= 1.1.5 =
* New feature:	JIRA WPB-2037	Added capability for auto-updates by BoldGrid API response.
* Testing:		JIRA WPB-2046	Tested on WordPress 4.5.3.
* Bug fix:		JIRA WPB-2086	Adding a new row was not allowing you to type in it.

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
