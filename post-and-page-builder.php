<?php
/**
 * Plugin Name: Post and Page Builder
 * Plugin URI: https://www.boldgrid.com/boldgrid-editor/
 * Description: Customized drag and drop editing for posts and pages. The Post and Page Builder adds functionality to the existing TinyMCE Editor to give you easier control over your content.
 * Version: 1.5.3
 * Author: BoldGrid.com <support@boldgrid.com>
 * Author URI: https://www.boldgrid.com/
 * Text Domain: boldgrid-editor
 * Domain Path: /languages
 * License: GPLv2 or later
 */

// Prevent direct calls.
if ( ! defined( 'WPINC' ) ) {
	die();
}

// Define Editor version.
if ( ! defined( 'BOLDGRID_EDITOR_VERSION' ) ) {
	define( 'BOLDGRID_EDITOR_VERSION', implode( get_file_data( __FILE__, array( 'Version' ), 'plugin' ) ) );
}

// Define Editor path.
if ( ! defined( 'BOLDGRID_EDITOR_PATH' ) ) {
	define( 'BOLDGRID_EDITOR_PATH', dirname( __FILE__ ) );
}

// Define Editor entry.
if ( ! defined( 'BOLDGRID_EDITOR_ENTRY' ) ) {
	define( 'BOLDGRID_EDITOR_ENTRY', __FILE__ );
}

// Define Editor configuration directory.
if ( ! defined( 'BOLDGRID_EDITOR_CONFIGDIR' ) ) {
	define( 'BOLDGRID_EDITOR_CONFIGDIR', BOLDGRID_EDITOR_PATH . '/includes/config' );
}

// Load the editor class.
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor.php';

register_activation_hook( __FILE__, array( 'Boldgrid_Editor_Activate', 'on_activate' ) );
register_deactivation_hook( __FILE__,  array( 'Boldgrid_Editor_Activate', 'on_deactivate' ) );

/**
 * Initialize the editor plugin for Editors and Administrators in the admin section.
 */
function boldgrid_editor_init () {
	Boldgrid_Editor_Service::register(
		'main',
		new Boldgrid_Editor()
	);

	Boldgrid_Editor_Service::get( 'main' )->run();
}

// Plugin update checks.
$upgrade = new Boldgrid_Editor_Upgrade();
add_action( 'upgrader_process_complete', array( $upgrade, 'plugin_update_check' ), 10, 2 );

// Load on an early hook so we can tie into framework configs.
if ( is_admin() ) {
	add_action( 'init', 'boldgrid_editor_init' );
} else {
	add_action( 'setup_theme', 'boldgrid_editor_init' );
}
