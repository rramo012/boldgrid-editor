<?php
/**
 * Plugin Name: BoldGrid Editor
 * Plugin URI: http://www.boldgrid.com
 * Description: Customized editing for pages and posts
 * Version: 1.3
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
	define( 'BOLDGRID_EDITOR_VERSION', implode( get_file_data( __FILE__, array( 'Version' ), 'plugin' ) ) );
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

register_activation_hook( __FILE__, array( 'Boldgrid_Editor_Activate', 'on_activate' ) );

/**
 * Initialize the editor plugin for Editors and Administrators in the admin section.
 */
function boldgrid_editor_init () {
	$boldgrid_editor = new Boldgrid_Editor();
}

// Load on an early hook so we can tie into framework configs.
if ( is_admin() ) {
	add_action( 'init', 'boldgrid_editor_init' );
} else {
	add_action( 'setup_theme', 'boldgrid_editor_init' );
}
