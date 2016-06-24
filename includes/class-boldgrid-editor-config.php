<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Editor_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

// Prevent direct calls.
if ( false === defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * BoldGrid Edit Config class.
 */
class Boldgrid_Editor_Config {
	/**
	 * Protected class property for $configs.
	 */
	private $configs;

	/**
	 * Getter for configs.
	 *
	 * @return array
	 */
	public function get_configs() {
		return $this->configs;
	}

	/**
	 * Setter for configs.
	 *
	 * @param array $configs The configuration array.
	 */
	private function set_configs( $configs ) {
		$this->configs = $configs;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Define Editor configuration directory, if not defined.
		if ( false === defined( 'BOLDGRID_EDITOR_CONFIGDIR' ) ) {
			define( 'BOLDGRID_EDITOR_CONFIGDIR', BOLDGRID_EDITOR_PATH . '/includes/config' );
		}

		// Get the global configs.
		$global_configs = require BOLDGRID_EDITOR_CONFIGDIR . '/config.plugin.php';

		// Get the local configs.
		$local_configs = array ();
		if ( file_exists( $local_config_filename = BOLDGRID_EDITOR_CONFIGDIR . '/config.local.php' ) ) {
			$local_configs = include $local_config_filename;
		}

		// If the user has an api key stored in their database, then set it as the global api_key // BradM //.
		$api_key_from_database = get_option( 'boldgrid_api_key' );

		if ( false === empty( $api_key_from_database ) ) {
			$global_configs['api_key'] = $api_key_from_database;
		}

		// Merge the global and local configs.
		$configs = array_merge( $global_configs, $local_configs );

		// Set the configs in a class property.
		$this->set_configs( $configs );
	}
}
