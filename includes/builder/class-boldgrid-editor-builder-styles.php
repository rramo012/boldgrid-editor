<?php
/**
 * Class: Boldgrid_Editor_Builder_Styles
 *
 * Handle adding custom stylesheets to the editor.
 *
 * @since      1.6
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Builder
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Builder_Styles
 *
 * Handle adding custom stylesheets to the editor.
 *
 * @since      1.6
 */
class Boldgrid_Editor_Builder_Styles {

	/**
	 * Get the html named input for the styles values.
	 *
	 * @since 1.6
	 *
	 * @return string HTML to render.
	 */
	public function get_input() {
		return "<input id='boldgrid-control-styles' style='display:none' name='boldgrid-control-styles'>";
	}

	/**
	 * Get the option value we use to display styles.
	 *
	 * @since 1.6
	 *
	 * @return array
	 */
	public static function get_option() {
		$styles = get_option( 'boldgrid_controls', array() );
		$styles = ! empty( $styles['styles'] ) ? $styles['styles'] : array();

		return $styles;
	}

	/**
	 * Save user styles created during edit process.
	 *
	 * @since 1.6
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
