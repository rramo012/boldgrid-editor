<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Layout
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */
class Boldgrid_Editor_Assets {

	public static function get_asset_suffix() {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
	}

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
	 * Get the site url or permalink whichever is found
	 *
	 * @param int $_REQUEST['post']
	 *
	 * @return string
	 */
	public function get_post_url() {
		$permalink = ! empty( $_REQUEST['post'] ) ? get_permalink( intval( $_REQUEST['post'] ) ) : null;
		return ( $permalink ? $permalink : get_site_url() );
	}

	function enqueue_mce_interface( $plugin_file ) {
		wp_register_script( 'wp-mce-draggable-imhwpb',
			plugins_url( self::get_minified_js( '/assets/js/editor/wp-mce-draggable' ), $plugin_file ),
			array (
				'jquery-ui-resizable'
			), BOLDGRID_EDITOR_VERSION, true );

		// Send Variables to the view
		wp_localize_script( 'wp-mce-draggable-imhwpb', 'BoldgridEditor',
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
				'instanceMenu' => Boldgrid_Editor_Builder::get_menu_markup(),
				'instancePanel' => Boldgrid_Editor_Builder::get_popup_markup(),
				'icons' => json_decode( file_get_contents( BOLDGRID_EDITOR_PATH . '/assets/json/font-awesome.json' ), true ),
				'images' => Boldgrid_Editor_Builder::get_post_images()
			) );

		wp_enqueue_script( 'wp-mce-draggable-imhwpb' );
	}

	/**
	 * Enqueue all scripts
	 *
	 * @global $is_IE
	 *
	 * @param int $_REQUEST['post']
	 */
	public function enqueue_scripts() {
		global $is_IE;

		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		wp_enqueue_script( 'media-imhwpb',
			plugins_url( self::get_minified_js( '/assets/js/media/media' ), $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		$this->enqueue_mce_interface( $plugin_file );

		// Drag n Drop Assets.
		$this->enqueue_drag_scripts( $plugin_file );

		wp_enqueue_script( 'boldgrid-editor-caman',
			plugins_url( '/assets/js/camanjs/caman.full.min.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-slim-scroll',
			plugins_url( '/assets/js/slimscroll/jquery.slimscroll.min.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_style( 'boldgrid-editor-jquery-ui',
			'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/smoothness/jquery-ui.css',
			false,
			BOLDGRID_EDITOR_VERSION,
			false);
	}


	public function enqueue_drag_scripts( $plugin_file ) {

		$deps = array( 'jquery-ui-draggable', 'jquery-ui-resizable', 'jquery-ui-slider' );

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

		wp_enqueue_script( 'boldgrid-editor-controls',
			plugins_url( '/assets/js/draggable/controls.js', $plugin_file ), array (  ),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-controls-container',
			plugins_url( '/assets/js/draggable/controls/container.js', $plugin_file ), array (),
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

		/*wp_enqueue_script( 'boldgrid-editor-resize-row',
			plugins_url( '/assets/js/draggable/resize/row.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );
		*/
		wp_enqueue_script( 'text-select-boldgrid',
			plugins_url( '/assets/js/jquery/jquery.text-select.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'is-typing-boldgrid',
			plugins_url( '/assets/js/jquery/jquery.is-typing.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-fourpan',
			plugins_url( '/assets/js/jquery/jquery.fourpan.js', $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );
	}

	/**
	 * Add All Styles needed for the editor
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

		wp_enqueue_style( 'editor-css-imhwpb' );
		wp_register_style( 'font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' );
	}


}
