<?php
/**
 * Class: Boldgrid_Editor_Assets
 *
 * Handle enqueues of styles and scripts.
 *
 * @since	  1.2.3
 * @package	Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Assets
 * @author	 BoldGrid <support@boldgrid.com>
 * @link	   https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Assets
 *
 * Handle enqueues of styles and scripts.
 *
 * @since	  1.2.3
 */
class Boldgrid_Editor_Assets {

	public function __construct( $configs ) {
		return $this->configs = $configs;
	}

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
		if ( false === in_array( $pagenow, array( 'post.php', 'post-new.php' ), true ) ) {
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
			plugins_url( '/assets/js/jquery-stellar/jquery.stellar.js', $plugin_file ),
		array( 'jquery' ),BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script(
			'boldgrid-editor-public', plugins_url( self::get_minified_js( '/assets/js/editor/public' ), $plugin_file ),
		array( 'jquery' ), BOLDGRID_EDITOR_VERSION, true );

		// Enqueue Styles that which depend on version.
		$this->enqueue_latest();

		// Buttons.
		wp_enqueue_style( 'boldgrid-buttons',
			plugins_url( '/assets/css/buttons.min.css', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'boldgrid-fe',
			plugins_url( '/assets/css/editor-fe.min.css', $plugin_file ),
		array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'bootstrap-styles', plugins_url( '/assets/css/bootstrap.min.css', $plugin_file ), '3.3.7' );

		// Control Styles.
		$style_url = Boldgrid_Editor_Builder_Styles::get_url_info();
		if ( $style_url['url'] ) {
			wp_enqueue_style( 'boldgrid-custom-styles',  $style_url['url'], array(), $style_url['timestamp'] );
		}
	}

	/**
	 * Check the version of an already enqueued stylesheet to make sure the latest version is enqueued.
	 *
	 * @since 1.5.
	 */
	public function enqueue_latest() {
		global $wp_styles;

		foreach ( $this->configs['conflicting_assets'] as $component ) {

			$version = ! empty( $wp_styles->registered[ $component['handle'] ]->ver )
				? $wp_styles->registered[ $component['handle'] ]->ver : false;

			if ( $version && version_compare( $version, $component['version'], '<' ) ) {
				wp_deregister_style( $component['handle'] );
			}

			wp_enqueue_style(
				$component['handle'],
				$component['src'],
				$component['deps'],
				$component['version']
			);
		}
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
		global $post;

		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		wp_register_script( 'wp-mce-draggable-imhwpb',
			plugins_url( self::get_minified_js( '/assets/js/editor/wp-mce-draggable' ), $plugin_file ),
			array(
				'jquery-ui-resizable'
		), BOLDGRID_EDITOR_VERSION, true );

		// Send Variables to the view.
		wp_localize_script( 'wp-mce-draggable-imhwpb', 'BoldgridEditor = BoldgridEditor || {}; BoldgridEditor',
			array(
				'plugin_configs' => $this->configs,
				'is_boldgrid_theme' => Boldgrid_Editor_Theme::is_editing_boldgrid_theme(),
				'body_class' => Boldgrid_Editor_Theme::theme_body_class(),
				'post' => ( array ) $post,
				'post_id' => $this->get_post_id(),
				'post_type' => $post ? $post->post_type : '',
				'is_boldgrid_template' => Boldgrid_Editor_Templater::get_instance()->is_custom_template( $post->page_template ),
				'site_url' => $this->get_post_url(),
				'plugin_url' => plugins_url( '', $plugin_file ),
				'is_IE' => $is_IE,
				'version' => BOLDGRID_EDITOR_VERSION,
				//'hasDraggableEnabled' => Boldgrid_Editor_MCE::has_draggable_enabled(),
				'hasDraggableEnabled' => true,
				'draggableEnableNonce' => wp_create_nonce( 'boldgrid_draggable_enable' ),
				'setupNonce' => wp_create_nonce( 'boldgrid_editor_setup' ),
				'icons' => json_decode( file_get_contents( BOLDGRID_EDITOR_PATH . '/assets/json/font-awesome.json' ), true ),
				'images' => Boldgrid_Editor_Builder::get_post_images(),
				'colors' => Boldgrid_Editor_Theme::get_color_palettes(),
				'saved_colors' => Boldgrid_Editor_Option::get( 'custom_colors', array() ),
				'sample_backgrounds' => Boldgrid_Editor_Builder::get_background_data(),
				'builder_config' => Boldgrid_Editor_Builder::get_builder_config(),
				'default_container' => Boldgrid_Editor_Builder::get_page_container(),
				//'display_update_notice' => Boldgrid_Editor_Version::should_display_notice(),
				'display_update_notice' => false,
				'display_intro' => Boldgrid_Editor_Setup::should_show_setup(),
				'setup_settings' => Boldgrid_Editor_Option::get( 'setup' ),
				'gridblocks' => Boldgrid_Layout::get_all_gridblocks(),
				'control_styles' => Boldgrid_Editor_Builder_Styles::get_option(),
				'admin-url' => get_admin_url(),
				'inspiration' => get_option( 'boldgrid_install_options' ),
				'grid_block_nonce' => wp_create_nonce( 'boldgrid_gridblock_image_ajax_nonce' )
			) );

		wp_enqueue_script( 'wp-mce-draggable-imhwpb' );
	}

	/**
	 * Get the query arg post, if not found, get home page post id.
	 *
	 * @since 1.4
	 *
	 * @return integer Post id.
	 */
	public function get_post_id() {
		$frontpage_id = get_option( 'page_on_front' );
		$post_id = ! empty( $_REQUEST['post'] ) ? intval( $_REQUEST['post'] ) : null;
		if ( ! $post_id ) {
			$post_id = $frontpage_id;
		}

		return $post_id;
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

		// Dependencies.
		$deps = array(
			'jquery',
			'jquery-ui-draggable',
			'jquery-ui-resizable',
			'jquery-ui-slider',
			'jquery-ui-droppable',
			'jquery-ui-selectmenu',
			'wp-color-picker',
			'jquery-masonry',
			'wp-util',
		);

		$script_url = plugins_url( '/assets/js/editor.min.js', $plugin_file );
		if ( defined( 'BGEDITOR_SCRIPT_DEBUG' ) && BGEDITOR_SCRIPT_DEBUG ) {
			$script_url = 'http://localhost:4000/bundle.js';
		}

		wp_enqueue_script( 'boldgrid-editor-drag',
			$script_url, $deps, BOLDGRID_EDITOR_VERSION, true );
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
		plugins_url( '/assets/css/animate.min.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'boldgrid-components',
			plugins_url( '/assets/css/components' . $suffix . '.css', $plugin_file ), array(),
			$this->configs['conflicting_assets']['boldgrid-components']['version'] );

		// If theme does not support BGTFW buttons, enqueue buttons.
		if ( ! Boldgrid_Editor_Theme::has_feature( 'button-lib' ) ) {
			wp_enqueue_style( 'boldgrid-buttons',
			plugins_url( '/assets/css/buttons.min.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );
		}

		wp_enqueue_style( 'font-family-styles',
		plugins_url( '/assets/css/font-family-controls.min.css', $plugin_file ), array(), BOLDGRID_EDITOR_VERSION );

		wp_enqueue_style( 'editor-css-imhwpb' );

		wp_register_style( 'font-awesome', plugins_url( '/assets/css/font-awesome.min.css', $plugin_file ), '4.7' );
	}

}
