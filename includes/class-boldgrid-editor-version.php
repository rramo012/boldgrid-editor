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
	 * Check if activated version if older than given version.
	 *
	 * @since 1.3
	 *
	 * @param string $older_than_version Version number to check against.
	 *
	 * @return boolean $is_old_version.
	 */
	public static function is_version_older( $older_than_version ) {
		$is_old_version = true;

		$check_version = Boldgrid_Editor_Option::get( 'activated_version' );
		if ( $check_version ) {
			$is_old_version = version_compare( $check_version, $older_than_version, '<' );
		}

		return $is_old_version;
	}

	/**
	 * Check if we should display admin notice.
	 *
	 * @since 1.3
	 *
	 * @return boolean Should we display admin notice.
	 */
	public static function should_display_notice() {
		// 1.3 is the version that we'll be displaying the notice for.
		return self::is_version_older('1.3') && ! Boldgrid_Editor_Option::get( 'displayed_v1.3_notice' );
	}

	/**
	 * If we should display admin notice, add body classes to trigger css.
	 *
	 * @since 1.3
	 */
	public function display_update_notice() {
		if ( self::should_display_notice() ) {
			wp_enqueue_style( 'bg-notification-fonts',
				'https://fonts.googleapis.com/css?family=Exo+2:300,600|Josefin+Sans:300,600' );
		}
	}

	/**
	 * Add option that will prevent admin notice from displaying again.
	 *
	 * @since 1.3
	 */
	public function save_notice_state() {
		if ( self::should_display_notice() ) {
			Boldgrid_Editor_Option::update( 'displayed_v1.3_notice', 1 );
		}
	}

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
