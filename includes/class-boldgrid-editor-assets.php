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
	 * @param string $script_name Path to file.
	 * @param string $type File Type.
	 *
	 * @return string Minified or empty string.
	 */
	public static function get_minified_js( $script_name, $type = '.js' ) {
		return $script_name . self::get_asset_suffix() . $type;
	}

	/**
	 * This is the action occur on the enqueue scripts action.
	 * Enqueues stylesheets and script for the editor page.
	 *
	 * @since 1.0
	 */
	public function enqueue_scripts_action() {
		global $pagenow;

		// "Not media-upload.php".
		if ( false == in_array( $pagenow, array( 'post.php', 'post-new.php' ) ) ) {
			return;
		}

		$this->enqueue_scripts();
		$this->add_styles();
	}

	/**
	 * Get the site url or permalink whichever is found.
	 *
	 * @since 1.0
	 *
	 * @return string url.
	 */
	public function get_post_url() {
		$permalink = ! empty( $_REQUEST['post'] ) ? get_permalink( intval( $_REQUEST['post'] ) ) : null;
		return ( $permalink ? $permalink : get_site_url() );
	}

	/**
	 * Enqueue Styles to the front end of the site.
	 *
	 * @since 1.2.7
	 */
	public function front_end() {
		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		// Parallax.
		// @TODO only enqueue if the user is using this.
		wp_enqueue_script( 'boldgrid-parallax',
			plugins_url( '/assets/js/jquery-stellar/jquery.stellar.min.js', $plugin_file ),
		array( 'jquery' ),BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script(
			'boldgrid-editor-public', plugins_url( self::get_minified_js( '/assets/js/editor/public' ), $plugin_file ),
		array( 'jquery' ), BOLDGRID_EDITOR_VERSION, true );

		// Boxes, image wraps, stuff like that.
		wp_enqueue_style( 'boldgrid-components',
			plugins_url( '/assets/css/components.min.css', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION );

		// Buttons.
		wp_enqueue_style( 'boldgrid-buttons',
			plugins_url( '/assets/css/buttons.min.css', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'bootstrap-styles', plugins_url( '/assets/css/bootstrap.min.css', $plugin_file ), '3.3.7' );
		wp_enqueue_style( 'font-awesome', plugins_url( '/assets/css/font-awesome.min.css', $plugin_file ), '4.6.3' );
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
			array(
				'jquery-ui-resizable'
		), BOLDGRID_EDITOR_VERSION, true );

		// Send Variables to the view.
		wp_localize_script( 'wp-mce-draggable-imhwpb', 'BoldgridEditor = BoldgridEditor || {}; BoldgridEditor',
			array(
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
				'saved_colors' => Boldgrid_Editor_Option::get( 'custom_colors', array() ),
				'sample_backgrounds' => Boldgrid_Editor_Builder::get_background_data(),
				'builder_config' => Boldgrid_Editor_Builder::get_builder_config(),
				'default_container' => Boldgrid_Editor_Builder::get_page_container(),
				'display_update_notice' => Boldgrid_Editor_Version::should_display_notice(),
		) );

		wp_enqueue_script( 'wp-mce-draggable-imhwpb' );
	}

	/**
	 * Enqueue all scripts.
	 *
	 * @since 1.2.3
	 */
	public function enqueue_scripts() {

		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		wp_enqueue_script( 'media-imhwpb',
			plugins_url( self::get_minified_js( '/assets/js/media/media' ), $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-suggest-crop',
			plugins_url( Boldgrid_Editor_Assets::get_minified_js( '/assets/js/media/crop' ), $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_style( 'boldgrid-editor-css-suggest-crop',
		plugins_url( '/assets/css/crop.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		// Drag n Drop Assets.
		$this->enqueue_mce_interface();
		$this->enqueue_drag_scripts();

		wp_enqueue_script( 'boldgrid-editor-caman',
			plugins_url( '/assets/js/camanjs/caman.full.min.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-slim-scroll',
			plugins_url( '/assets/js/slimscroll/jquery.slimscroll.min.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_style( 'boldgrid-editor-jquery-ui',
			'//ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/smoothness/jquery-ui.css',
		false, BOLDGRID_EDITOR_VERSION, false );
	}

	/**
	 * Enqueue scripts to be used on the page and post editor.
	 *
	 * @since 1.2.3
	 */
	public function enqueue_drag_scripts() {
		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		// Color Picker with alpha channel: https://github.com/23r9i0/wp-color-picker-alpha.
		// @TODO Add this dep to gulp build.
		wp_enqueue_script( 'wp-color-picker-alpha',
			plugins_url( '/assets/js/wp-color-picker-alpha/wp-color-picker-alpha.js', $plugin_file ),
		array( 'jquery', 'wp-color-picker' ), null, true );

		// Dependencies.
		$deps = array(
			'jquery-ui-draggable',
			'jquery-ui-resizable',
			'jquery-ui-slider',
			'jquery-ui-droppable',
			'jquery-ui-selectmenu',
			'jquery-masonry',
		);

		if ( defined( 'SCRIPT_DEBUG' ) && ! SCRIPT_DEBUG ) {
			wp_enqueue_script( 'boldgrid-editor-drag',
				plugins_url( '/assets/js/editor.min.js', $plugin_file ),
			$deps, BOLDGRID_EDITOR_VERSION, true );

			return;
		}

		wp_enqueue_script( 'boldgrid-editor-drag',
			plugins_url( '/assets/js/builder/drag.js', $plugin_file ),
		$deps, BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-panel',
			plugins_url( '/assets/js/builder/panel.js', $plugin_file ),
			array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-menu',
			plugins_url( '/assets/js/builder/menu.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-validation-section',
			plugins_url( '/assets/js/builder/validation/section.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls',
			plugins_url( '/assets/js/builder/controls.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-tooltips',
			plugins_url( '/assets/js/builder/tooltips.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-container',
			plugins_url( '/assets/js/builder/controls/container.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-image-change',
			plugins_url( '/assets/js/builder/controls/image/change.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-add',
			plugins_url( '/assets/js/builder/controls/add.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-section',
			plugins_url( '/assets/js/builder/controls/section.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-icon',
			plugins_url( '/assets/js/builder/controls/icon.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-image-design',
			plugins_url( '/assets/js/builder/controls/image/design.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-button',
			plugins_url( '/assets/js/builder/controls/button.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-image-filter',
			plugins_url( '/assets/js/builder/controls/image/filter.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-font',
			plugins_url( '/assets/js/builder/controls/font.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-background',
			plugins_url( '/assets/js/builder/controls/background.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-media-edit',
			plugins_url( '/assets/js/builder/controls/media/edit.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-media-map',
			plugins_url( '/assets/js/builder/controls/media/map.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-color',
			plugins_url( '/assets/js/builder/controls/color.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-builder',
			plugins_url( '/assets/js/builder/controls/box.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-resize-row',
			plugins_url( '/assets/js/builder/resize/row.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-text-select',
			plugins_url( '/assets/js/jquery/jquery.text-select.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-is-typing',
			plugins_url( '/assets/js/jquery/jquery.is-typing.js', $plugin_file ), array(),
		BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-fourpan',
			plugins_url( '/assets/js/jquery/jquery.fourpan.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-render-fonts',
			plugins_url( '/assets/js/builder/render-fonts.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-generic',
			plugins_url( '/assets/js/builder/controls/generic.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-util',
			plugins_url( '/assets/js/builder/util.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-drag-section',
			plugins_url( '/assets/js/builder/drag/section.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-drag-row',
			plugins_url( '/assets/js/builder/drag/row.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-drag-notice-update',
			plugins_url( '/assets/js/builder/notice/update.js', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION, true );
	}

	/**
	 * Add All Styles needed for the editor in the the wordpress doc.
	 *
	 * @since 1.0
	 */
	public function add_styles() {
		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		$suffix = self::get_asset_suffix();

		wp_register_style( 'genericons-imhwpb',
		plugins_url( '/assets/css/genericons.min.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		wp_register_style( 'editor-css-imhwpb',
		plugins_url( '/assets/css/editor' . $suffix . '.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'editor-animate-css',
		plugins_url( '/assets/css/animate.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'boldgrid-components',
		plugins_url( '/assets/css/components' . $suffix . '.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		// If theme does not support BGTFW buttons, enqueue buttons.
		if ( ! Boldgrid_Editor_Theme::has_feature( 'button-lib' ) ) {
			wp_enqueue_style( 'boldgrid-buttons',
			plugins_url( '/assets/css/buttons.min.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );
		}

		wp_enqueue_style( 'font-family-styles',
		plugins_url( '/assets/css/font-family-controls.min.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'editor-css-imhwpb' );

		wp_register_style( 'font-awesome', plugins_url( '/assets/css/font-awesome.min.css', $plugin_file ), '4.6.3' );

	}

}
