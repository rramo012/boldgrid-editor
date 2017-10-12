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
		$is_bg_theme = Boldgrid_Editor_Service::get( 'main' )->get_is_boldgrid_theme();
		$url = false;

		// Currently disabled for BG themes. BG themes should use the BG color palette system (theme switching).
		if ( ! $is_bg_theme ) {
			if ( ! empty( $option['css_filename'] ) ) {
				$url = $option['css_filename'];
			} else {
				$url = plugins_url( '/assets/css/custom-styles.css', BOLDGRID_EDITOR_ENTRY );
			}
		}

		return array(
			'url' => $url,
			'timestamp' => ! empty( $option['timestamp'] ) ? $option['timestamp'] : false,
		);
	}

	/**
	 * Check if the theme requires the default stylesheet.
	 *
	 * @since 1.6
	 *
	 * @return boolean.
	 */
	public function requires_default_styles() {
		$option = self::get_option();
		return empty( $option['css_filename'] ) && ! Boldgrid_Editor_Service::get( 'main' )->get_is_boldgrid_theme();
	}

	/**
	 * Check if the user has saved a specific type of custom style.
	 *
	 * @since 1.6
	 *
	 * @param  string  $name Name of custom style.
	 * @return boolean       Whether or not the style has been saved.
	 */
	public function has_custom_style( $name ) {
		$has_custom_style = false;
		$option = self::get_option();
		$configs = ! empty( $option['configuration'] ) ? $option['configuration'] : array();

		foreach( $configs as $config ) {
			if ( $name === $config['id'] ) {
				$has_custom_style = true;
				break;
			}
		}

		return $has_custom_style;
	}

	/**
	 * Get the option value we use to display styles.
	 *
	 * @since 1.6
	 *
	 * @return array
	 */
	public static function get_option() {
		return Boldgrid_Editor_Option::get( 'styles', array() );
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

			Boldgrid_Editor_Option::update( 'styles', array(
				'configuration' => $styles,
				'css_filename' => $css_file,
				'timestamp' => time()
			) );
		}
	}

}
