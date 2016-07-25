<?php
/**
 * Plugin Name: BoldGrid Editor
 * Plugin URI: http://www.boldgrid.com
 * Description: Customized editing for pages and posts
 * Version: 1.2.1
 * Author: BoldGrid.com <wpb@boldgrid.com>
 * Author URI: http://www.boldgrid.com
 * Text Domain: boldgrid-editor
 * Domain Path: /languages
 * License: GPLv2 or later
 */

// Prevent direct calls.
if ( false === defined( 'WPINC' ) ) {
	die();
}

// Define Editor version.
if ( false === defined( 'BOLDGRID_EDITOR_VERSION' ) ) {
	define( 'BOLDGRID_EDITOR_VERSION', '1.2.1 );
}

// Define Editor path.
if ( false === defined( 'BOLDGRID_EDITOR_PATH' ) ) {
	define( 'BOLDGRID_EDITOR_PATH', dirname( __FILE__ ) );
}

// Define Editor configuration directory.
if ( false === defined( 'BOLDGRID_EDITOR_CONFIGDIR' ) ) {
	define( 'BOLDGRID_EDITOR_CONFIGDIR', BOLDGRID_EDITOR_PATH . '/includes/config' );
}

// Load the editor class.
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor.php';

// If DOING_CRON, then check if this plugin should be auto-updated.
if ( true === defined( 'DOING_CRON' ) && DOING_CRON ){
	// Ensure required definitions for pluggable.
	if ( false === defined( 'AUTH_COOKIE' ) ) {
		define( 'AUTH_COOKIE', null );
	}

	if ( false === defined( 'LOGGED_IN_COOKIE' ) ) {
		define( 'LOGGED_IN_COOKIE', null );
	}

	// Load the pluggable class, if needed.
	require_once ABSPATH . 'wp-includes/pluggable.php';

	// Include the update class.
	require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-update.php';

	// Instantiate the update class.
	$plugin_update = new Boldgrid_Editor_Update();

	// Check and update plugins.
	$plugin_update->wp_update_this_plugin();
}

/**
 * Initialize the editor plugin for Editors and Administrators in the admin section.
 */
function boldgrid_editor_init() {
	if ( is_admin() && current_user_can( 'edit_pages' ) ) {
		$editor = new Boldgrid_Editor();
	}
}

add_action( 'init', 'boldgrid_editor_init' );
