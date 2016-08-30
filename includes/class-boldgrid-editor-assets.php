<?php
/**
 * Class: Boldgrid_Editor_Assets
 *
 * Handle enqueues of styles and scripts.
 *
 * @since      1.2.3
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Assets
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Assets
 *
 * Handle enqueues of styles and scripts.
 *
 * @since      1.2.3
 */
class Boldgrid_Editor_Assets {

	/**
	 * Get minified or unminified asset suffix.
	 *
	 * @since 1.2.3
	 *
	 * @return string Minified or empty string.
	 */
	public static function get_asset_suffix() {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
	}

	/**
	 * Append min.js or .js to a string depending on whether or not script debug is on.
	 *
	 * @since 1.2.3
	 *
	 * @return string Minified or empty string.
	 */
	public static function get_minified_js( $script_name ) {
		return $script_name . self::get_asset_suffix() . '.js';
	}

	/**
	 * This is the action occur on the enqueue scripts action.
	 * Enqueues stylesheets and script for the editor page.
	 *
	 * @since 1.0
	 */
	public function enqueue_scripts_action() {
		global $pagenow;

		if ( false == in_array( $pagenow, array (
			'post.php',
			'post-new.php'
		) ) ) {
			return;
		}

		$this->enqueue_scripts();
		$this->add_styles();
	}

	/**
	 * Get the site url or permalink whichever is found.
	 *
	 * @global $is_IE
	 *
	 * @param int $_REQUEST['post']
	 */
	public function get_post_url() {
		$permalink = ! empty( $_REQUEST['post'] ) ? get_permalink( intval( $_REQUEST['post'] ) ) : null;
		return ( $permalink ? $permalink : get_site_url() );
	}

	/**
	 * Enqueue WPMCE Draggable.
	 *
	 * @since 1.2.3
	 *
	 * @global $is_IE
	 */
	public function enqueue_mce_interface() {
		global $is_IE;

		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		wp_register_script( 'wp-mce-draggable-imhwpb',
			plugins_url( self::get_minified_js( '/assets/js/editor/wp-mce-draggable' ), $plugin_file ),
			array (
				'jquery-ui-resizable'
			), BOLDGRID_EDITOR_VERSION, true );

		// Send Variables to the view
		wp_localize_script( 'wp-mce-draggable-imhwpb', 'BoldgridEditor = BoldgridEditor || {}; BoldgridEditor',
			array (
				'is_boldgrid_theme' => Boldgrid_Editor_Theme::is_editing_boldgrid_theme(),
				'body_class' => Boldgrid_Editor_Theme::theme_body_class(),
				'post_id' => ! empty( $_REQUEST['post'] ) ? intval( $_REQUEST['post'] ) : null,
				'site_url' => $this->get_post_url(),
				'plugin_url' => plugins_url( '', $plugin_file ),
				'is_IE' => $is_IE,
				'version' => BOLDGRID_EDITOR_VERSION,
				'hasDraggableEnabled' => Boldgrid_Editor_MCE::has_draggable_enabled(),
				'draggableEnableNonce' => wp_create_nonce( 'boldgrid_draggable_enable' ),
				'icons' => json_decode( file_get_contents( BOLDGRID_EDITOR_PATH . '/assets/json/font-awesome.json' ), true ),
				'images' => Boldgrid_Editor_Builder::get_post_images(),
				'colors' => Boldgrid_Editor_Theme::get_color_palettes(),
				'saved_colors' => Boldgrid_Editor_Builder::get_editor_option( 'custom_colors', array() ),
				'sample_backgrounds' => Boldgrid_Editor_Builder::get_background_data(),
				'builder_config' => Boldgrid_Editor_Builder::get_builder_config(),
				'default_container' => Boldgrid_Editor_Builder::get_page_container()
			) );

		wp_enqueue_script( 'wp-mce-draggable-imhwpb' );
	}

	/**
	 * Enqueue all scripts.
	 *
	 * @since 1.2.3
	 *
	 * @param int $_REQUEST['post'].
	 */
	public function enqueue_scripts() {

		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		wp_enqueue_script( 'media-imhwpb',
			plugins_url( self::get_minified_js( '/assets/js/media/media' ), $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		// Drag n Drop Assets.
		$this->enqueue_mce_interface();
		$this->enqueue_drag_scripts();

		wp_enqueue_script( 'boldgrid-editor-caman',
			plugins_url( '/assets/js/camanjs/caman.full.min.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-slim-scroll',
			plugins_url( '/assets/js/slimscroll/jquery.slimscroll.min.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_style( 'boldgrid-editor-jquery-ui',
			'//ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/smoothness/jquery-ui.css',
			false,
			BOLDGRID_EDITOR_VERSION,
			false);
	}

	/**
	 * Enqueue scripts to be used on the page and post editor.
	 *
	 * @since 1.2.3
	 *
	 * @param int $_REQUEST['post'].
	 */
	public function enqueue_drag_scripts() {
		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		// Color Picker with alpha channel: https://github.com/23r9i0/wp-color-picker-alpha.
		wp_enqueue_script( 'wp-color-picker-alpha',
			plugins_url( '/assets/js/wp-color-picker-alpha/wp-color-picker-alpha.js', $plugin_file ),
			array( 'jquery', 'wp-color-picker' ), null, true );

		// Dependencies:
		$deps = array(
			'jquery-ui-draggable',
			'jquery-ui-resizable',
			'jquery-ui-slider',
			'jquery-ui-droppable',
			'jquery-ui-selectmenu',
			'jquery-masonry'
		);

		if ( defined( 'SCRIPT_DEBUG' ) && ! SCRIPT_DEBUG ) {
			wp_enqueue_script( 'boldgrid-editor-drag',
				plugins_url( '/assets/js/editor.min.js', $plugin_file ),
				$deps, BOLDGRID_EDITOR_VERSION, true );

			return;
		}

		wp_enqueue_script( 'boldgrid-editor-drag',
			plugins_url( '/assets/js/draggable/drag.js', $plugin_file ),
			$deps, BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-panel',
			plugins_url( '/assets/js/draggable/panel.js', $plugin_file ),
			array(),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-menu',
			plugins_url( '/assets/js/draggable/menu.js', $plugin_file ), array(),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-validation-section',
			plugins_url( '/assets/js/draggable/validation/section.js', $plugin_file ), array(),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls',
			plugins_url( '/assets/js/draggable/controls.js', $plugin_file ), array (  ),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-tooltips',
			plugins_url( '/assets/js/draggable/tooltips.js', $plugin_file ), array (  ),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-container',
			plugins_url( '/assets/js/draggable/controls/container.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-add',
			plugins_url( '/assets/js/draggable/controls/add.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-section',
			plugins_url( '/assets/js/draggable/controls/section.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-icon',
			plugins_url( '/assets/js/draggable/controls/icon.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-image',
			plugins_url( '/assets/js/draggable/controls/image.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-button',
			plugins_url( '/assets/js/draggable/controls/button.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-image-filter',
			plugins_url( '/assets/js/draggable/controls/image-filter.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-font',
			plugins_url( '/assets/js/draggable/controls/font.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-background',
			plugins_url( '/assets/js/draggable/controls/background.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-color',
			plugins_url( '/assets/js/draggable/controls/color.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-builder',
			plugins_url( '/assets/js/draggable/controls/box.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-resize-row',
			plugins_url( '/assets/js/draggable/resize/row.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'text-select-boldgrid',
			plugins_url( '/assets/js/jquery/jquery.text-select.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'is-typing-boldgrid',
			plugins_url( '/assets/js/jquery/jquery.is-typing.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-fourpan',
			plugins_url( '/assets/js/jquery/jquery.fourpan.js', $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-render-fonts',
			plugins_url( '/assets/js/render-fonts.js', $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-generic',
			plugins_url( '/assets/js/draggable/controls/generic.js', $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );
	}

	/**
	 * Add All Styles needed for the editor.
	 *
	 * @since 1.0
	 */
	public function add_styles() {
		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		$suffix = self::get_asset_suffix();

		wp_register_style( 'genericons-imhwpb',
			plugins_url( '/assets/css/genericons.css', $plugin_file ), array (), BOLDGRID_EDITOR_VERSION );

		wp_register_style( 'editor-css-imhwpb',
			plugins_url( '/assets/css/editor' . $suffix . '.css', $plugin_file ), array (), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'button-css-imhwpb',
			plugins_url( '/assets/buttons/css/buttons.css', $plugin_file ), array (), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'font-family-styles',
			plugins_url( '/assets/css/font-family-controls.min.css', $plugin_file ), array (), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'editor-css-imhwpb' );
		wp_register_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' );
	}

	public function add_editor_styles() {
		//@Todo: make sure this doesnt conflict with framework.
		add_editor_style( '//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' );
	}
}