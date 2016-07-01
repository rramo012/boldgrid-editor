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
	private $theme_stylesheet;

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
	 * Constructor
	 *
	 * @param array $settings
	 */
	public function __construct( $settings ) {
		$config = new Boldgrid_Editor_Config( $settings );
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

	public function get_post_images( $post_id = null ) {
		$current_post_id = $post_id ? $post_id : $_REQUEST['post'];
		$attachments = get_children( array( 'post_parent' => $current_post_id,
			'post_status' => 'inherit',
			'post_type' => 'attachment',
			'post_mime_type' => 'image',
			'order' => 'ASC',
			'orderby' => 'menu_order ID'
		) );

		$image_lookups = array();
		foreach( $attachments as $attachment ) {
			$full_img_url = wp_get_attachment_image_src ( $attachment->ID, 'thumbnail' );
			$image[ 'attachment_id' ] = $attachment->ID;
			$image[ 'thumbnail' ] = ! empty( $full_img_url[0] ) ? $full_img_url[0] : null;
			$image_lookups[] = $image;
		}

		return $image_lookups;
	}

	/**
	 * Create tabs on post, post-new, media-upload
	 */
	public function add_hooks() {
		// Admin hooks:
		if ( is_admin() ) {
			// Check PHP and WordPress versions for compatibility:
			add_action( 'admin_init', array (
				$this,
				'check_php_wp_versions'
			) );

			add_filter( 'boldgrid_create_gridblocks', 'Boldgrid_Layout::get_universal_gridblocks' );
		}

		$valid_pages = array (
			'post.php',
			'post-new.php',
			'media-upload.php'
		);

		$edit_post_page = in_array( basename( $_SERVER['SCRIPT_NAME'] ), $valid_pages );
		if ( $edit_post_page ) {

			// Do not run these hooks for an attachment or nav menu item post type
			$current_post_id = ! empty( $_REQUEST['post'] ) ? $_REQUEST['post'] : null;
			$current_post = get_post( $current_post_id );
			$current_post_type = ! empty( $current_post->post_type ) ? $current_post->post_type : null;
			if ( $current_post_type == 'attachment' || $current_post_type == 'nav_menu_item' ) {
				return false;
			}

			add_action( 'media_buttons', array (
				$this,
				'load_editor_hooks'
			) );

			// Creates all tabs as specified by the configuration:
			$is_boldgrid_theme = self::is_editing_boldgrid_theme();

			$this->set_is_boldgrid_theme( $is_boldgrid_theme );

			$this->theme_body_class = $this->theme_body_class();

			$this->create_tabs();

			$this->add_window_size_buttons();

			add_action( 'media_buttons', array (
				$this,
				'help_pointers'
			) );

			add_action( 'media_buttons',
				function () {
					wp_enqueue_style( 'genericons-imhwpb' );
					wp_enqueue_style( 'font-awesome' );
				} );

			// This has a high priority to override duplicate files in other boldgrid plugins
			add_action( 'admin_enqueue_scripts',
				array (
					$this,
					'enqueue_scripts_action'
				), 5 );

			$this->prepend_editor_styles();


			// Add ?boldgrid-editor-version=$version_number to each added file
			add_filter( 'mce_css', array (
				$this,
				'add_cache_busting'
			) );

		}

		global $wp_customize;
		if ( $edit_post_page || isset( $wp_customize ) ) {
			// Append Editor Styles
			add_filter( 'tiny_mce_before_init', array (
				$this,
				'allow_empty_tags'
			), 29 );

			add_filter( 'mce_buttons_2', array (
				$this,
				'mce_buttons'
			) );
		}

		add_action( 'wp_ajax_boldgrid_gridblock_image',
			array (
				$this,
				'boldgrid_gridblock_image_ajax'
			) );

		add_action( 'wp_ajax_boldgrid_canvas_image',
			array (
				$this,
				'upload_canvas_image_ajax'
			) );

		// Save a users selection for enabling draggable.
		add_action( 'wp_ajax_boldgrid_draggable_enabled',
			array (
				$this,
				'ajax_draggable_enabled'
			) );

		add_action( 'wp_ajax_boldgrid_gridblock_html',
			array (
				$this,
				'boldgrid_gridblock_html_ajax'
			) );

		add_action( 'admin_print_footer_scripts',
			array (
				$this,
				'print_scripts'
			), 25 );

		// Plugin updates
		require_once BOLDGRID_EDITOR_PATH . '/includes/class-boldgrid-editor-update.php';

		$plugin_update = new Boldgrid_Editor_Update( $this );

		$boldgrid_editor_crop = new Boldgrid_Editor_Crop();
		$boldgrid_editor_crop->add_hooks();
	}

	public function print_scripts() {
		print include BOLDGRID_EDITOR_PATH . '/includes/template/button.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/image.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/image-filter.php';
	}

	/**
	 * Saves the state of the drag and drop editor feature.
	 * Ajax Action: wp_ajax_boldgrid_draggable_enabled.
	 *
	 * @since 1.0.9
	 */
	public function ajax_draggable_enabled () {
		check_ajax_referer( 'boldgrid_draggable_enable', 'security' );

		// Sanitize to boolean.
		$draggable_enabled = ! empty( $_POST['draggable_enabled'] );
		set_theme_mod( 'boldgrid_draggable_enabled', $draggable_enabled );

		wp_die( 1 );
	}

	/**
	 * Adding Dropdowns to the second row of the tinymce toolbar
	 *
	 * @param array $buttons
	 * @return array
	 */
	public function mce_buttons( $buttons ) {
		array_unshift( $buttons, 'fontselect' ); // Add Font Select
		array_unshift( $buttons, 'fontsizeselect' ); // Add Font Size Select
		return $buttons;
	}

	/**
	 * Styles that should be loaded before the theme styles
	 */
	public function prepend_editor_styles() {
		add_editor_style(
			plugins_url( '/assets/css/bootstrap.min.css',
				BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ) );

		add_editor_style(
			plugins_url( '/assets/js/draggable/css/before-theme.css',
				BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ) );

		add_editor_style( '//fonts.googleapis.com/css?family=Open+Sans:600' );
	}

	/**
	 * This is the action occur on the enqueue scripts action.
	 * Enqueues stylesheets and script for the editor page.
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
	 * Add Help Pointer to Boldgrid Editing
	 */
	public function help_pointers() {
		// Dont add the help pointer if this is a boldgrid theme
		if ( $this->get_is_boldgrid_theme() ) {
			return;
		}

		$pointers = array (
			array (
				'id' => 'boldgrid-editor',
				'screen' => 'page',
				'target' => '[aria-label="BoldGrid Editing"]',
				'title' => 'BoldGrid Editing',
				'content' => 'BoldGrid Editing is currently disabled because your currently ' .
					 'active theme is not a BoldGrid theme. You can try enabling BoldGrid Editing with this button.',
					'position' => array (
						'edge' => 'right',
						'align' => 'middle'
					)
			)
		);

		$myPointers = new Boldgrid_Editor_Pointer( $pointers );
	}

	/**
	 * Create Tabs based on configurations
	 */
	public function create_tabs() {
		$configs = $this->get_tab_configs();
		$tabs = $configs['tabs'];

		/**
		 * Retrieve addtional configs
		 */
		$api_configs = array ();
		$premium_configs = $this->get_api_configs();
		if ( ! empty( $premium_configs ) ) {

			$api_configs = $premium_configs['api_configs'];
			if ( ! empty( $premium_configs['tab_configs'] ) ) {
				$tabs = array_merge_recursive( $tabs, $premium_configs['tab_configs'] );
			}
		}

		/**
		 * Create each tab specified from the configuraiton.
		 */
		foreach ( $tabs as $tab ) {
			$media_tab_class = 'Boldgrid_Editor_Media_Tab';

			if ( isset( $tab['content-class'] ) ) {
				$media_tab_class = $tab['content-class'];
			}

			$tab['is-boldgrid-theme'] = $this->get_is_boldgrid_theme();
			$tab['api_configs'] = $api_configs;

			$media_tab = new $media_tab_class( $tab, $this->get_path_configs(), '/' );

			$media_tab->create();
		}
	}

	public function upload_canvas_image_ajax() {
		$image_data = ! empty( $_POST['image_data'] ) ? $_POST['image_data'] : null;
		$attachement_id = ! empty( $_POST['attachement_id'] ) ? $_POST['attachement_id'] : null;

		$original_attachment = ( array ) get_post ( $attachement_id );

		$image_data = str_replace( 'data:image/png;base64,', '', $image_data );
		$image_data = str_replace( ' ', '+', $image_data );
		$data = base64_decode( $image_data );
		$filename = mktime() . ".png";
		$uploaded = wp_upload_bits( $filename, null, $data );

		$success = false;
		$response = array();
		if ( empty( $uploaded['error'] ) ) {

			// Retrieve the file type from the file name.
			$wp_filetype = wp_check_filetype( $uploaded['file'], null );

			// Generate the attachment data.
			unset( $original_attachment['ID'] );
			unset( $original_attachment['post_name'] );
			unset( $original_attachment['post_date'] );
			unset( $original_attachment['post_date_gmt'] );
			unset( $original_attachment['post_modified'] );
			unset( $original_attachment['post_modified_gmt'] );
			$attachment = array (
				'post_mime_type' => $wp_filetype['type'],
				'guid' => $uploaded['url'],
			);

			$attachment = array_merge( $original_attachment, $attachment );

			/*
			 * Insert the attachment into the media library.
			 * $attachment_id is the ID of the entry created in the wp_posts table.
			 */
			$attachment_id = wp_insert_attachment(
				$attachment,
				$uploaded['file'],
				$original_attachment['post_parent']
			);

			if ( 0 != $attachment_id ) {
				$success = true;

				$attach_data = wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] );
				$result = wp_update_attachment_metadata( $attachment_id, $attach_data );

				$response = array(
					'attachment_id' => $attachment_id,
					'url' => $uploaded['url'],
					'images' => $this->get_post_images( $original_attachment['post_parent'] )
				);
			}
		}

		$response['success'] = $success;
		print json_encode( $response );
		wp_die();
	}

	/**
	 * When a GridBlock is inserted, and there are images that require attribution.
	 * They also need need to be inserted into the media library
	 * This ajax call allows a filter to set the new urls of the of the images that need replacing
	 * Without filters, the images will be placeholders
	 * With the BoldGrid suite of plugins, this is done by the Inspirations Plugin
	 *
	 * @param array $_POST['boldgrid_asset_ids']
	 */
	public function boldgrid_gridblock_image_ajax() {
		$boldgrid_asset_ids = ! empty( $_POST['boldgrid_asset_ids'] ) ? $_POST['boldgrid_asset_ids'] : '[]';

		// Validate nonce
		$valid = wp_verify_nonce( $_POST['boldgrid_gridblock_image_ajax_nonce'],
			'boldgrid_gridblock_image_ajax_nonce' );
		if ( false == $valid ) {
			wp_die( - 1 );
		}

		$boldgrid_asset_ids = json_decode( $boldgrid_asset_ids );

		$boldgrid_dynamic_images = array ();
		if ( ! empty( $_POST['dynamic_images'] ) && is_array( $_POST['dynamic_images'] ) ) {
			$boldgrid_dynamic_images = $_POST['dynamic_images'];
		}

		// Sanatize input
		foreach ( $boldgrid_asset_ids as $key => $boldgrid_asset_id ) {
			$boldgrid_asset_ids[$key] = array (
				'asset_id' => intval( $boldgrid_asset_id ),
				'url' => false
			);
		}

		// Sanatize input
		$dynamic_images_sanitized = array ();
		foreach ( $boldgrid_dynamic_images as $key => $boldgrid_dynamic_image ) {
			$dynamic_images_sanitized[$key] = array (
				'url' => false,

				'id_from_provider' => ! empty( $boldgrid_dynamic_image['id_from_provider'] ) ? intval(
					$boldgrid_dynamic_image['id_from_provider'] ) : null,

				'image_provider_id' => ! empty( $boldgrid_dynamic_image['image_provider_id'] ) ? intval(
					$boldgrid_dynamic_image['image_provider_id'] ) : null,

				'rand_image_id' => ! empty( $boldgrid_dynamic_image['rand_image_id'] ) ? intval(
					$boldgrid_dynamic_image['rand_image_id'] ) : null,

				'post_id' => ! empty( $boldgrid_dynamic_image['post_id'] ) ? intval(
					$boldgrid_dynamic_image['post_id'] ) : null
			);
		}
		$boldgrid_dynamic_images = $dynamic_images_sanitized;

		/**
		 * At this point, $boldgrid_asset_ids may look like the following:
		 *
		 * Array (
		 * * [0] => Array (
		 * * * [asset_id] => 82978
		 * * * [url] => false
		 * * * )
		 * * [1] => Array (
		 * * * [asset_id] => 82979
		 * * * [url] => false
		 * * )
		 * )
		 *
		 * The "boldgrid_insert_attribute_assets" filter below will allow us to change the value of
		 * 'url' for each of the assets. This will allow us to download the asset to the media
		 * library, and show the correct image. If we don't modify the 'url', then a generic
		 * placeholder will be shown.
		 */
		$boldgrid_asset_ids = apply_filters( 'boldgrid_insert_attribute_assets',
			$boldgrid_asset_ids );

		$boldgrid_dynamic_images = apply_filters( 'boldgrid_gridblock_insert_dynamic_images',
			$boldgrid_dynamic_images );

		// Make sure we return an array - failsafe
		if ( false == is_array( $boldgrid_asset_ids ) ) {
			$boldgrid_asset_ids = array ();
		}
		if ( false == is_array( $dynamic_images_sanitized ) ) {
			$dynamic_images_sanitized = array ();
		}

		echo json_encode(
			array (
				'success' => true, // Hard Coded, fails will occur when process does not reach here
				'asset_ids' => $boldgrid_asset_ids,
				'dynamic_images' => $boldgrid_dynamic_images
			) );
		wp_die();
	}

	/**
	 * An API call is made to this action in order to render gridblocks that are not available
	 * at the initial load of the media modal.
	 *
	 * @param array $_POST['boldgrid_gridblock_image_html_nonce'].
	 * @since 1.0.6
	 */
	public function boldgrid_gridblock_html_ajax() {
		// Validate nonce.
		$valid = wp_verify_nonce( $_POST['boldgrid_gridblock_image_html_nonce'],
			'boldgrid_gridblock_html_ajax_nonce' );

		if ( false == $valid ) {
			wp_die( - 1 );
		}

		// Get data from gridblocks from other plugins.
		$boldgrid_gridblock_data = array ();
		$boldgrid_gridblock_data = apply_filters( 'boldgrid_dynamic_gridblocks',
			$boldgrid_gridblock_data );

		// Setting Default return values.
		$build_profile_id = null;
		$boldgrid_gridblock_pages = array ();
		if ( ! empty( $boldgrid_gridblock_data['pages'] ) &&
			 ! empty( $boldgrid_gridblock_data['build_profile']['id'] ) ) {
			$boldgrid_gridblock_pages = $boldgrid_gridblock_data['pages'];
			$build_profile_id = $boldgrid_gridblock_data['build_profile']['id'];
		}

		// Split into blocks here.
		$parsed_gridblock_html_collection = array ();
		foreach ( $boldgrid_gridblock_pages as $gridblock_data ) {
			$html = $gridblock_data['preview_data']['post_content'];
			$parsed_gridblock_html = Boldgrid_Layout::parse_gridblocks( $html );

			foreach ( $parsed_gridblock_html as $key => $parsed_gridblock ) {
				$parsed_gridblock_html[$key]['api_insert'] = true;
				$parsed_gridblock_html[$key]['boldgrid_page_id'] = ( int ) $gridblock_data['boldgrid_page_data']['id'];
				$parsed_gridblock_html[$key]['build_profile_id'] = ( int ) $build_profile_id;
			}

			$parsed_gridblock_html_collection = array_merge( $parsed_gridblock_html_collection,
				$parsed_gridblock_html );
		}

		// Sorts and remove duplicate blocks.
		$parsed_gridblock_html_collection = Boldgrid_Layout::cleanup_gridblock_collection(
			$parsed_gridblock_html_collection );

		echo json_encode(
			array (
				'success' => true,
				'gridblocks' => $parsed_gridblock_html_collection
			), JSON_HEX_QUOT | JSON_HEX_TAG );

		wp_die();
	}

	/**
	 * Add an additional query arg to each css file included in the tinymce iframe.
	 * E.g. boldgrid-editor-version=1.0.0
	 *
	 * @param string $css
	 * @since 1.0.2
	 * @return string
	 */
	public function add_cache_busting( $css ) {
		if ( empty( $css ) ) {
			return $css;
		}

		$styles = explode( ',', $css );

		// Add a couple of styles that need to append the iframe head
		$styles[] = plugins_url( '/assets/css/genericons.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$styles[] = plugins_url( '/assets/js/draggable/css/draggable.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$styles[] = plugins_url( '/assets/css/editor.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$styles[] = plugins_url( '/assets/buttons/css/buttons.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		// Add Query Args
		$mce_css = array ();
		foreach ( $styles as $editor_style ) {
			$mce_css[] = add_query_arg( 'boldgrid-editor-version', BOLDGRID_EDITOR_VERSION,
				$editor_style );
		}

		return implode( ',', $mce_css );
	}

	/**
	 * Add Extended valid elements
	 *
	 * @param
	 *        	array | string $init
	 * @return array
	 */
	public function allow_empty_tags( $init ) {
		$extra_tags = array (
			'div[*]',
			'i[*]'
		);

		$init['extended_valid_elements'] = array ();

		if ( empty( $init['extended_valid_elements'] ) ) {
			$init['extended_valid_elements'] = '';
		} elseif ( is_array( $init['extended_valid_elements'] ) ) {
			$init['extended_valid_elements'] = array_merge( $init['extended_valid_elements'],
				$extra_tags );

			return $init;
		} else {
			$init['extended_valid_elements'] = $init['extended_valid_elements'] . ',';
		}

		// Note: Using .= here can trigger a fatal error
		$init['extended_valid_elements'] = $init['extended_valid_elements'] .
			 implode( ',', $extra_tags );

		// Always show wordpress 2 toolbar
		$init['wordpress_adv_hidden'] = false;
		$init['fontsize_formats'] = '8px 10px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px';

		return $init;
	}

	/**
	 * Get Premium Configurations.
	 *
	 * @return array
	 */
	public function get_api_configs() {
		$additional_configs = array ();

		if ( $this->get_config() ) {
			$configs = $this->get_config()
				->get_configs();

			$configs = apply_filters( 'boldgrid_editor_api_configs', $configs );
			$additional_configs['api_configs'] = $configs;
			$additional_configs['api_configs']['connection_successful'] = false;

			if ( isset( $configs['api_key'] ) ) {

				$body['key'] = $configs['api_key'];

				$url = $configs['asset_server'] . $configs['ajax_calls']['get_page_post_layouts'];

				$request = new WP_Http();

				$result = $request->request( $url,
					array (
						'method' => 'POST',
						'body' => $body
					) );

				if ( ! is_object( $result ) && isset( $result['body'] ) ) {
					$response = json_decode( $result['body'], true );

					if ( isset( $response['result']['data']['tabs'] ) ) {
						$additional_configs['tab_configs'] = $response['result']['data']['tabs'];
						$additional_configs['api_configs']['connection_successful'] = true;
					}
				}
			}
		}

		return $additional_configs;
	}

	/**
	 * Check to see if we are editing a boldgrid theme page
	 * Keeping in mind that if this is a staged page it will be using the staged theme.
	 * If the staged theme is not a Boldgrid theme, and this is a staged page return false
	 *
	 * @return boolean
	 */
	public static function is_editing_boldgrid_theme() {
		$post_id = ! empty( $_REQUEST['post'] ) ? intval( $_REQUEST['post'] ) : null;

		$is_editing_boldgrid_theme = ( bool ) self::get_boldgrid_theme_name( wp_get_theme() );

		if ( $post_id ) {
			$post_status = get_post_status( $post_id );

			$staging_theme_stylesheet = get_option( 'boldgrid_staging_stylesheet' );

			$staged_theme = wp_get_theme( $staging_theme_stylesheet );

			if ( 'staging' == $post_status && is_object( $staged_theme ) ) {
				$is_editing_boldgrid_theme = ( bool ) self::get_boldgrid_theme_name( $staged_theme );
			}
		}

		/**
		 * Allow other theme developers to indicate that they would like all BG edit tools enabled.
		 *
		 * @since 1.0.9
		 *
		 * @param boolean $is_editing_boldgrid_theme Whether or not the user is editing a BG theme.
		 */
		$is_editing_boldgrid_theme = apply_filters( 'is_editing_boldgrid_theme', $is_editing_boldgrid_theme );

		return $is_editing_boldgrid_theme;
	}

	/**
	 * Returns the name of a theme if and only if the theme is a boldgrid theme
	 *
	 * @param WP_Theme $wp_theme
	 * @return string
	 */
	public static function get_boldgrid_theme_name( $wp_theme ) {
		$current_boldgrid_theme = '';

		$current_theme = $wp_theme;

		if ( is_a( $current_theme, 'WP_Theme' ) &&
			 strpos( $current_theme->get( 'TextDomain' ), 'boldgrid' ) !== false ) {
			$current_boldgrid_theme = $current_theme->get( 'Name' );
		}

		return $current_boldgrid_theme;
	}

	/**
	 * Get the site url or perma link whichever is found
	 *
	 * @param int $_REQUEST['post']
	 *
	 * @return string
	 */
	public function get_post_url() {
		$permalink = ! empty( $_REQUEST['post'] ) ? get_permalink( intval( $_REQUEST['post'] ) ) : null;
		return ( $permalink ? $permalink : get_site_url() );
	}

	/**
	 * Get the correct theme body class
	 *
	 * @param int $_REQUEST['post']
	 *
	 * @return string
	 */
	public function theme_body_class() {
		$post_id = ! empty( $_REQUEST['post'] ) ? intval( $_REQUEST['post'] ) : null;

		$stylesheet = get_stylesheet();

		$staging_theme_stylesheet = get_option( 'boldgrid_staging_stylesheet' );

		if ( $staging_theme_stylesheet ) {
			$staged_theme = wp_get_theme( $staging_theme_stylesheet );

			$post_status = get_post_status( $post_id );

			if ( 'staging' == $post_status && is_object( $staged_theme ) ) {
				$stylesheet = $staging_theme_stylesheet;
			}
		}

		$this->theme_stylesheet = $stylesheet;

		$theme_mods = get_option( 'theme_mods_' . $stylesheet );

		$boldgrid_palette_class = ! empty( $theme_mods['boldgrid_palette_class'] ) ? $theme_mods['boldgrid_palette_class'] : 'palette-primary';

		return ( $boldgrid_palette_class ? $boldgrid_palette_class : $stylzr_palette_class );
	}

	/**
	 * Check whether or not Drag and Drop is enabled.
	 *
	 * By default DnD (Drag and Drop) is disabled for non BG themes and enabled for BG themes.
	 * If the user explicitly chooses whether to activate or deactivate DnD, we save it as a theme mod
	 * on the theme. This means that upon activating a non BG theme for the first time, it will always
	 * be disabled, even if you have previously enabled it on another theme.
	 *
	 * @since 1.0.9
	 *
	 * @return boolean Whether or not drggable is enabled.
	 */
	public function has_draggable_enabled() {
		return get_theme_mod( 'boldgrid_draggable_enabled', $this->get_is_boldgrid_theme() );
	}

	public function get_menu_markup() {
		return file_get_contents( BOLDGRID_EDITOR_PATH . '/includes/temp.html' );
	}

	public function get_popup_markup() {
		return file_get_contents( BOLDGRID_EDITOR_PATH . '/includes/popup.html' );
	}

	public static function get_asset_suffix() {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
	}

	/**
	 * Enqueue all scripts
	 *
	 * @param int $_REQUEST['post']
	 */
	public function enqueue_scripts() {
		global $is_IE;

		$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';
		wp_enqueue_script( 'boldgrid-fourpan', plugins_url( '/assets/js/jquery/jquery.fourpan.js', $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'media-imhwpb', plugins_url( '/assets/js/media.js', $plugin_file ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		wp_register_script( 'wp-mce-draggable-imhwpb',
			plugins_url( '/assets/js/wp-mce-draggable.js', $plugin_file ),
			array (
				'jquery-ui-resizable'
			), BOLDGRID_EDITOR_VERSION, true );

		$fonts = json_decode( file_get_contents( BOLDGRID_EDITOR_PATH . '/assets/json/font-awesome.json' ), true );

		// Send Variables to the view
		wp_localize_script( 'wp-mce-draggable-imhwpb', 'BoldgridEditor',
			array (
				'is_boldgrid_theme' => $this->get_is_boldgrid_theme(),
				'body_class' => $this->theme_body_class,
				'post_id' => ! empty( $_REQUEST['post'] ) ? intval( $_REQUEST['post'] ) : null,
				'site_url' => $this->get_post_url(),
				'plugin_url' => plugins_url( '', $plugin_file ),
				'is_IE' => $is_IE,
				'version' => BOLDGRID_EDITOR_VERSION,
				'hasDraggableEnabled' => $this->has_draggable_enabled(),
				'draggableEnableNonce' => wp_create_nonce( 'boldgrid_draggable_enable' ),
				'instanceMenu' => $this->get_menu_markup(),
				'instancePanel' => $this->get_popup_markup(),
				'icons' => $fonts,
				'images' => $this->get_post_images()
			) );


		wp_enqueue_script( 'text-select-boldgrid',
			plugins_url( '/assets/js/jquery/jquery.text-select.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'is-typing-boldgrid',
			plugins_url( '/assets/js/jquery/jquery.is-typing.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'wp-mce-draggable-imhwpb' );


		/**
		 * Drag n Drop Assets.
		 */
		wp_enqueue_script( 'boldgrid-editor-drag',
			plugins_url( '/assets/js/draggable/drag.js', $plugin_file ), array (),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-panel',
			plugins_url( '/assets/js/draggable/panel.js', $plugin_file ), array (
					'jquery-ui-draggable', 'jquery-ui-resizable', 'jquery-ui-slider' ),
			BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-editor-menu',
			plugins_url( '/assets/js/draggable/menu.js', $plugin_file ), array (  ),
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

	/**
	 * Actions that should be triggered on media_buttons_context action
	 */
	public function load_editor_hooks() {
		echo '<button type="button" id="insert-gridblocks-button" class="button gridblock-icon">' .
			 '<span class="wp-media-buttons-icon"></span> Add GridBlock</button>';
	}

	/**
	 * Adding tinyMCE buttons
	 */
	public function add_window_size_buttons() {
		add_action( 'admin_head', array (
			$this,
			'add_mce_buttons'
		) );
	}

	/**
	 * Adding tinyMCE plugins
	 *
	 * @param array $plugin_array
	 * @return array
	 */
	public function add_tinymce_plugin( $plugin_array ) {
		$editor_js_file = plugins_url( '/assets/js/editor.js',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$plugin_array['monitor_view_imhwpb'] = $editor_js_file;
		$plugin_array['tablet_view_imhwpb'] = $editor_js_file;
		$plugin_array['phone_view_imhwpb'] = $editor_js_file;
		$plugin_array['toggle_draggable_imhwpb'] = $editor_js_file;

		return $plugin_array;
	}

	/**
	 * Registering 3 new buttons
	 *
	 * @param array $buttons
	 * @return array
	 */
	public function register_mce_button( $buttons ) {
		array_push( $buttons, 'monitor_view_imhwpb' );
		array_push( $buttons, 'tablet_view_imhwpb' );
		array_push( $buttons, 'phone_view_imhwpb' );
		array_push( $buttons, 'toggle_draggable_imhwpb' );

		return $buttons;
	}

	/**
	 * Procedure for adding new buttons
	 */
	public function add_mce_buttons() {
		global $typenow;

		// verify the post type
		if ( ! in_array( $typenow, array (
			'post',
			'page'
		) ) ) {
			return;
		}

		// check if WYSIWYG is enabled
		if ( 'true' == get_user_option( 'rich_editing' ) ) {
			add_filter( 'mce_external_plugins', array (
				$this,
				'add_tinymce_plugin'
			) );

			add_filter( 'mce_buttons', array (
				$this,
				'register_mce_button'
			) );
		}
	}

	/**
	 * Check PHP and WordPress versions for compatibility
	 */
	public function check_php_wp_versions() {
		// Check that PHP is installed at our required version or deactivate and die:
		$required_php_version = '5.3';
		if ( version_compare( phpversion(), $required_php_version, '<' ) ) {
			deactivate_plugins( BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );
			wp_die(
				'<p><center><strong>BoldGrid Editor</strong> requires PHP ' . $required_php_version .
					 ' or greater.</center></p>', 'Plugin Activation Error',
					array (
						'response' => 200,
						'back_link' => TRUE
					) );
		}

		// Check to see if WordPress version is installed at our required minimum or deactivate and
		// die:
		global $wp_version;
		$required_wp_version = '4.2';
		if ( version_compare( $wp_version, $required_wp_version, '<' ) ) {
			deactivate_plugins( BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );
			wp_die(
				'<p><center><strong>BoldGrid Editor</strong> requires WordPress ' .
					 $required_wp_version . ' or higher.</center></p>', 'Plugin Activation Error',
					array (
						'response' => 200,
						'back_link' => TRUE
					) );
		}
	}
}



