<?php
/**
 * Plugin Name: BoldGrid Editor
 * Plugin URI: http://www.boldgrid.com
 * Description: Customized editing for pages and posts
 * Version: 1.1.1.2
 * Author: BoldGrid.com <wpb@boldgrid.com>
 * Author URI: http://www.boldgrid.com
 * Text Domain: boldgrid-editor
 * Domain Path: /languages
 * License: GPLv2 or later
 */

// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	die();
}

// Define Editor version:
if ( ! defined( 'BOLDGRID_EDITOR_VERSION' ) ) {
	define( 'BOLDGRID_EDITOR_VERSION', '1.1.1.2' );
}

// Define Editor Path
if ( ! defined( 'BOLDGRID_EDITOR_PATH' ) ) {
	define( 'BOLDGRID_EDITOR_PATH', __DIR__ );
}

// Load the editor class:
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor.php';

/**
 * Initialize the editor plugin for Editors and Administrators in the admin section
 */
function boldgrid_editor_init() {
	if ( is_admin() && current_user_can( 'edit_pages' ) ) {
		// Crete the settings array:
		$settings = array (
			'configDir' => BOLDGRID_EDITOR_PATH . '/includes/config'
		);

		$editor = new Boldgrid_Editor( $settings );
	}
}

add_action( 'init', 'boldgrid_editor_init' );
