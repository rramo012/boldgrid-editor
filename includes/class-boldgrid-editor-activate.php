<?php
/**
 * Class: Boldgrid_Editor_Option
*
* Helper methods for organizing wordpress options.
*
* @since      1.3
* @package    Boldgrid_Editor
* @subpackage Boldgrid_Editor_Option
* @author     BoldGrid <support@boldgrid.com>
* @link       https://boldgrid.com
*/

/**
 * Class: Boldgrid_Editor_Option
*
* Parse pages to find component usage.
*
* @since      1.3
*/
class Boldgrid_Editor_Activate {

	public static function on_activate() {
		Boldgrid_Editor_Option::update( 'activated_version', BOLDGRID_EDITOR_VERSION );
	}

}