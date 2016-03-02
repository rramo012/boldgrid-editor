<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Editor_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * BoldGrid Edit Config class
 */
class Boldgrid_Editor_Config {
	/**
	 * Protected class property for $configs:
	 */
	private $configs;
	
	/**
	 * Getter for $configs:
	 *
	 * @return unknown $configs
	 */
	public function get_configs() {
		return $this->configs;
	}
	
	/**
	 * Setter for $configs:
	 *
	 * @param unknown $s        	
	 */
	private function set_configs( $configs ) {
		$this->configs = $configs;
	}
	
	/**
	 * Constructor
	 *
	 * @param unknown $settings        	
	 */
	public function __construct( $settings ) {
		$config_dir = $settings['configDir'];
		
		$global_configs = require $config_dir . '/config.plugin.php';
		
		$local_configs = array ();
		if ( file_exists( $local_config_filename = $config_dir . '/config.local.php' ) ) {
			$local_configs = include $local_config_filename;
		}
		
		// if the user has an api key stored in their database, then set it as the global api_key // BradM //
		$api_key_from_database = get_option( 'boldgrid_api_key' );
		
		if ( ! empty( $api_key_from_database ) ) {
			$global_configs['api_key'] = $api_key_from_database;
		}
		
		$configs = array_merge( $global_configs, $local_configs );
		
		$this->set_configs( $configs );
	}
}
