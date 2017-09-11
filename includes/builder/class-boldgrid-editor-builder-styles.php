<?php
/**
 * Class: Boldgrid_Editor_Builder_Styles
 *
 * Add functionality for fully customizable editor pages.
 *
 * @since      1.2
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Builder
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Builder_Styles
 *
 * Add functionality for fully customizable editor pages.
 *
 * @since      1.2
 */
class Boldgrid_Editor_Builder_Styles {

	public function get_input() {
		$styles = get_option( 'boldgrid_control_styles', array() );
		return "<input id='boldgrid-control-styles' style='display:none' value='" . json_encode( $styles ) ."' name='boldgrid-control-styles'>";
	}

	/**
	 * Save user colors created during edit process.
	 *
	 * @since 1.3
	 */
	public function save() {
		if ( isset( $_REQUEST['boldgrid-control-styles'] ) ) {

			$styles = ! empty( $_REQUEST['boldgrid-control-styles'] ) ?
				sanitize_text_field( wp_unslash( $_REQUEST['boldgrid-control-styles'] ) ) : '';

			$styles = json_decode( $styles, true );
			$styles = is_array( $styles ) ? $styles : array();

			//@todo create stylesheet.

			update_option( 'boldgrid_controls', array(
				'styles' => array(
					'configuration' => $styles,
					'css_filename' => '/wp-content/coolstyles.css'
				)
			) );
		}
	}
}
