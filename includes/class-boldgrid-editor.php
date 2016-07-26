<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Editor
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */
if ( ! class_exists( 'Boldgrid_Editor_Media_Tab' ) ) {
	require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-media-tab.php';
}

require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-layout.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-config.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-pointer.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-crop.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-update.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-ajax.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-assets.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-builder.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-mce.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-theme.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-version.php';
require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-media.php';

/**
 * BoldGrid Editor class
 */
class Boldgrid_Editor {

	/**
	 * BoldGrid Editor Config object
	 *
	 * @var Boldgrid_Editor_Config
	 */
	private $config;

	/**
	 * A full array of tab configurations
	 *
	 * @var array
	 */
	private $tab_configs;

	/**
	 * Path configurations used for the plugin
	 */
	private $path_configs;

	/**
	 * Is the current page theme a BoldGrid theme?
	 *
	 * @var bool
	 */
	private $is_boldgrid_theme = false;

	/**
	 * The stylesheet being edited
	 *
	 * @var string
	 */
	//private $theme_stylesheet;

	/**
	 * Get $this->settings
	 *
	 * @return array
	 */
	public function get_config() {
		return $this->config;
	}

	/**
	 * Set $this->settings
	 *
	 * @return bool
	 */
	public function set_config( $config ) {
		$this->config = $config;
		return true;
	}

	/**
	 * Get $this->tab_configs
	 *
	 * @return array
	 */
	public function get_tab_configs() {
		return $this->tab_configs;
	}

	/**
	 * Set $this->tab_configs
	 *
	 * @return array
	 */
	public function set_tab_configs( $tab_configs ) {
		$this->tab_configs = $tab_configs;
		return true;
	}

	/**
	 * Get $this->path_configs
	 *
	 * @return array
	 */
	public function get_path_configs() {
		return $this->path_configs;
	}

	/**
	 * Set $this->path_configs
	 *
	 * @return bool
	 */
	public function set_path_configs( $path_configs ) {
		$this->path_configs = $path_configs;
		return true;
	}

	/**
	 * Get $this->is_boldgrid_theme
	 *
	 * @return array
	 */
	public function get_is_boldgrid_theme() {
		return $this->is_boldgrid_theme;
	}

	/**
	 * Set $this->is_boldgrid_theme
	 *
	 * @return bool
	 */
	public function set_is_boldgrid_theme( $is_boldgrid_theme ) {
		$this->is_boldgrid_theme = $is_boldgrid_theme;
		return true;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		$config = new Boldgrid_Editor_Config();
		$this->set_config( $config );

		$tab_configs = require BOLDGRID_EDITOR_PATH . '/includes/config/layouts.php';
		$tab_configs = apply_filters( 'boldgrid-media-modal-config', $tab_configs );
		$this->set_tab_configs( $tab_configs );

		$plugin_filename = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';

		$path_configs = array (
			'plugin_dir' => BOLDGRID_EDITOR_PATH,
			'plugin_filename' => $plugin_filename
		);
		$this->set_path_configs( $path_configs );

		// Add hooks:
		$this->add_hooks();
	}

	/**
	 * Create tabs on post, post-new, media-upload
	 *
	 * @global $wp_customize.
	 */
	public function add_hooks() {
		global $wp_customize;

		$boldgrid_editor_ajax     = new Boldgrid_Editor_Ajax();
		$boldgrid_editor_assets   = new Boldgrid_Editor_Assets();
		$boldgrid_editor_builder  = new Boldgrid_Editor_Builder();
		$boldgrid_editor_mce      = new Boldgrid_Editor_MCE();
		$boldgrid_editor_media    = new Boldgrid_Editor_Media();
		$boldgrid_editor_theme    = new Boldgrid_Editor_Theme();
		$boldgrid_editor_version  = new Boldgrid_Editor_Version();

		// Admin hooks:
		if ( is_admin() ) {
			// Check PHP and WordPress versions for compatibility.
			add_action( 'admin_init', array ( $boldgrid_editor_version, 'check_php_wp_versions' ) );

			// Provide a way to access gridblock files in this plugin.
			add_filter( 'boldgrid_create_gridblocks', 'Boldgrid_Layout::get_universal_gridblocks' );
		}

		$valid_pages = array (
			'post.php',
			'post-new.php',
			'media-upload.php'
		);

		$edit_post_page = in_array( basename( $_SERVER['SCRIPT_NAME'] ), $valid_pages );
		if ( $edit_post_page ) {


			// Do not run these hooks for an attachment or nav menu item post type.
			$current_post_id = ! empty( $_REQUEST['post'] ) ? $_REQUEST['post'] : null;
			$current_post = get_post( $current_post_id );
			$current_post_type = ! empty( $current_post->post_type ) ? $current_post->post_type : null;
			if ( $current_post_type == 'attachment' || $current_post_type == 'nav_menu_item' ) {
				return false;
			}

			add_action( 'media_buttons', array( $boldgrid_editor_mce, 'load_editor_hooks' ) );
			add_action( 'media_buttons', array( $boldgrid_editor_builder, 'enqueue_styles' ) );

			// Creates all tabs as specified by the configuration.
			$is_boldgrid_theme = Boldgrid_Editor_Theme::is_editing_boldgrid_theme();
			$this->set_is_boldgrid_theme( $is_boldgrid_theme );

			// Create media modal tabs.
			$boldgrid_editor_media->create_tabs( $this->get_tab_configs(), $is_boldgrid_theme );

			// Add screen display buttons.
			$boldgrid_editor_mce->add_window_size_buttons();

			add_action( 'media_buttons', array ( $boldgrid_editor_mce, 'help_pointers' ) );

			// This has a high priority to override duplicate files in other boldgrid plugins.
			add_action( 'admin_enqueue_scripts', array( $boldgrid_editor_assets, 'enqueue_scripts_action' ), 5 );

			$boldgrid_editor_mce->prepend_editor_styles();

			// Add ?boldgrid-editor-version=$version_number to each added file.
			add_filter( 'mce_css', array ( $boldgrid_editor_mce, 'add_cache_busting' ) );

		}

		if ( $edit_post_page || isset( $wp_customize ) ) {
			// Append Editor Styles.
			add_filter( 'tiny_mce_before_init', array ( $boldgrid_editor_mce, 'allow_empty_tags' ), 29 );
			add_filter( 'mce_buttons_2', array ( $boldgrid_editor_mce, 'mce_buttons' ) );
		}

		add_action( 'wp_ajax_boldgrid_gridblock_image', array ( $boldgrid_editor_ajax, 'boldgrid_gridblock_image_ajax' ) );
		add_action( 'wp_ajax_boldgrid_canvas_image',array ( $boldgrid_editor_ajax, 'upload_canvas_image_ajax' ) );

		// Save a users selection for enabling draggable.
		add_action( 'wp_ajax_boldgrid_draggable_enabled', array ( $boldgrid_editor_ajax, 'ajax_draggable_enabled' ) );
		add_action( 'wp_ajax_boldgrid_gridblock_html', array ( $boldgrid_editor_ajax, 'boldgrid_gridblock_html_ajax' ) );
		add_action( 'admin_print_footer_scripts', array ( $boldgrid_editor_builder, 'print_scripts' ), 25 );

		// Plugin updates.
		$plugin_update = new Boldgrid_Editor_Update( $this );

		$boldgrid_editor_crop = new Boldgrid_Editor_Crop();
		$boldgrid_editor_crop->add_hooks();
	}

}
