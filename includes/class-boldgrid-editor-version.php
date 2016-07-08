<?php
/**
 * Class: Boldgrid_Editor_Version
 *
 * This is the class responsible for checking if the users wordpress and php versions are acceptable.
 *
 * @since      1.2
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Version
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Version
 *
 * This is the class responsible for checking if the users wordpress and php versions are acceptable.
 *
 * @since      1.2
 */
class Boldgrid_Editor_Version {

	/**
	 * Check PHP and WordPress versions for compatibility
	 */
	public function check_php_wp_versions() {
		// Check that PHP is installed at our required version or deactivate and die:
		$required_php_version = '5.3';
		if ( version_compare( phpversion(), $required_php_version, '<' ) ) {
			deactivate_plugins( BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );
			wp_die(
				'<p><center><strong>BoldGrid Editor</strong> requires PHP ' . $required_php_version .
				' or greater.</center></p>', 'Plugin Activation Error',
				array (
					'response' => 200,
					'back_link' => TRUE
				) );
		}

		// Check to see if WordPress version is installed at our required minimum or deactivate and
		// die:
		global $wp_version;
		$required_wp_version = '4.2';
		if ( version_compare( $wp_version, $required_wp_version, '<' ) ) {
			deactivate_plugins( BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );
			wp_die(
				'<p><center><strong>BoldGrid Editor</strong> requires WordPress ' .
				$required_wp_version . ' or higher.</center></p>', 'Plugin Activation Error',
				array (
					'response' => 200,
					'back_link' => TRUE
				) );
		}
	}
}
