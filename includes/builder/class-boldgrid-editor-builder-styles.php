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
	 * Get url info for the saved css file.
	 *
	 * @since 1.6
	 *
	 * @return array Properties of file.
	 */
	public static function get_url_info() {
		$option = self::get_option();

		return array(
			'url' => ! empty( $option['css_filename'] ) ? $option['css_filename'] : false,
			'timestamp' => ! empty( $option['timestamp'] ) ? $option['timestamp'] : false,
		);
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
	 * Create a string of the css created in the eidtor.
	 *
	 * @since 1.6
	 *
	 * @param  array $styles List of styles.
	 * @return string        CSS.
	 */
	public function create_css_string( $styles ) {
		$css = '';
		foreach( $styles as $style ) {
			$css .= $style['css'];
		}

		return $css;
	}

	/**
	 * Create the css file.
	 *
	 * @since 1.6
	 *
	 * @param  string $css CSS to save to a file.
	 * @return string      URL to new file.
	 */
	public function create_file( $css ) {
		$upload_dir = wp_upload_dir();
		wp_mkdir_p( $upload_dir['basedir'] . '/boldgrid' );
		$filename = '/boldgrid/custom-styles.css';
		$new_filename = $upload_dir['basedir'] . $filename;
		$editor_fs = new Boldgrid_Editor_Fs();
		$editor_fs->save( $css, $new_filename );

		return $upload_dir['baseurl'] . $filename;
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

			// Create stylesheet.
			$css = $this->create_css_string( $styles );
			$css_file = $this->create_file( $css );

			update_option( 'boldgrid_controls', array(
				'styles' => array(
					'configuration' => $styles,
					'css_filename' => $css_file,
					'timestamp' => time()
				)
			) );
		}
	}

}
