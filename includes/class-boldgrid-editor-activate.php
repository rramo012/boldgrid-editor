<?php
/**
* Class: Boldgrid_Editor_Activate
*
* Plugin Activation hooks.
*
* @since      1.3
* @package    Boldgrid_Editor
* @subpackage Boldgrid_Editor_Activate
* @author     BoldGrid <support@boldgrid.com>
* @link       https://boldgrid.com
*/

/**
* Class: Boldgrid_Editor_Activate
*
* Plugin Activation hooks.
*
* @since      1.3
*/
class Boldgrid_Editor_Activate {

	/**
	 * Run actions that should occur when plugin activated.
	 *
	 * @since 1.3.
	 * @return HTML to be inserted.
	 */
	public static function on_activate() {
		Boldgrid_Editor_Option::update( 'activated_version', BOLDGRID_EDITOR_VERSION );
	}

}