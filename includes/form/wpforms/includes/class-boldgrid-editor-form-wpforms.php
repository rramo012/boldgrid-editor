<?php

/**
 * BoldGrid Forms class
 */
class Boldgrid_Editor_Form_Wpforms {
	/**
	 * Class property to hold the Boldgrid_Ninja_Form_Config class:
	 *
	 * @var Boldgrid_Ninja_Forms_Config
	 */
	private $boldgrid_ninja_form_config;

	/**
	 * A full array of tab configurations
	 *
	 * @var array
	 */
	protected $tab_configs;

	/**
	 * Path configurations used for the plugin
	 */
	protected $path_configs;

	/**
	 * Accessor for tab configs
	 *
	 * @return array
	 */
	public function get_tab_configs() {
		return $this->tab_configs;
	}

	/**
	 * Accessor for path configs
	 *
	 * @return array
	 */
	public function get_path_configs() {
		return $this->path_configs;
	}

	/**
	 * Initialize tab configs.
	 */
	public function __construct() {
		$addonDir = dirname( __FILE__ );
		$this->tab_configs = include( $addonDir . '/config/layouts.php' );

		$this->path_configs = array (
			'plugin_dir' => BOLDGRID_EDITOR_PATH,
			'plugin_filename' => BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php'
		);
	}


	/**
	 * Get plugin directory
	 *
	 * @static
	 *
	 * @return string
	 */
	public static function derive_plugin_dir() {
		return realpath( dirname( dirname( dirname( __FILE__ ) ) ) );
	}

	/**
	 * Javascript needed for editor
	 *
	 * @return void
	 */
	public function enqueue_header_content() {
		global $pagenow;

		if ( false == in_array( $pagenow, array (
			'post.php',
			'post-new.php'
		) ) ) {
			return;
		}

		wp_enqueue_script( 'media-imhwpb',
			plugins_url( '/boldgrid/assets/js/media.js', $this->path_configs['plugin_filename'] ),
			array (), BOLDGRID_EDITOR_VERSION, true );

		wp_enqueue_script( 'boldgrid-form-shortcode',
			plugins_url( '/boldgrid/assets/js/shortcode.js',
				$this->path_configs['plugin_filename'] ), array (), BOLDGRID_EDITOR_VERSION, true );
	}

	/**
	 * Initialization hook for BoldGrid Ninja forms
	 *
	 * @return void
	 */
	public function init() {
		global $pagenow;

		add_action( 'admin_init', array ( $this, 'admin_init' ) );
		add_filter( 'ninja_forms_starter_form_contents', array ( $this, 'modify_starter_forms' ) );
		add_filter( 'wpforms_display_media_button', array( $this, 'remove_media_button' ) );
/*
		$test = do_shortcode( '[wpforms id="12370"]' );
		var_dump( $test );die;
		var_dump( wpforms_decode( get_posts( ['post_type' => 'wpforms'])[0]->post_content ) );*/
	}

	/**
	 * Initialization process for administration section if Boldgrid Ninja Forms
	 *
	 * @return void
	 */
	public function admin_init() {
		$valid_pages = array (
			'post.php',
			'post-new.php',
			'media-upload.php'
		);

		$edit_post_page = in_array( basename( $_SERVER['SCRIPT_NAME'] ), $valid_pages );
		if ( is_admin() && $edit_post_page ) {

			// Create Media Modal Tabs
			$this->create_tabs();

			// Print all forms as media templates
			add_action( 'print_media_templates',
				array (
					$this,
					'print_media_templates'
				) );

			// load up any css / js we need
			add_action( 'admin_enqueue_scripts',
				array (
					$this,
					'enqueue_header_content'
				), 15 );
		}
	}

	/**
	 * Static method that will add all forms that have been defined in the
	 * boldgrid/includes/prebuilt-forms folder
	 *
	 * @static
	 *
	 * @return void
	 */
	public static function add_prebuilt_forms() {

		// Get the site's title:
		$site_title = get_bloginfo( 'name' );

		// Get the site's email address:
		$email_address = get_bloginfo( 'admin_email' );

		// If the current blog's admin email address is missing, then try the network.
		if ( empty( $email_address ) ) {
			$email_address = get_site_option( 'admin_email' );
		}
	}

	/**
	 * Get form markup
	 *
	 * @static
	 *
	 * @param int $form_id
	 *
	 * @return string
	 */
	public static function get_form_markup( $form_id ) {
		if ( function_exists( 'ninja_forms_display_form' ) ) {
			return ninja_forms_return_echo( 'ninja_forms_display_form', $form_id );
		}
	}

	/**
	 * Add prebuilt forms
	 *
	 * @return string
	 */
	public function modify_starter_forms() {
		self::add_prebuilt_forms();

		return '';
	}

	/**
	 * Get forms
	 *
	 * @static
	 *
	 * @return array
	 */
	public static function get_forms() {
		// Todo:
		// ninja_forms_get_all_forms());

		// Connect to the WordPress database:
		global $wpdb;

		// Query the database:
		$results = $wpdb->get_results(
			"SELECT distinct form_id FROM {$wpdb->prefix}ninja_forms_fields", OBJECT );

		// Initialize $form_ids array:
		$form_ids = array ();

		// Populate the $form_ids array:
		foreach ( $results as $result ) {
			if ( ! empty( $result->form_id ) ) {
				$form_ids[] = array (
					'id' => $result->form_id
				);
			}
		}

		// Return the resulting array:
		return $form_ids;
	}

	/**
	 * Remove the WPForms TinyMCE media button.
	 *
	 * In the function below we disable displaying the media button
	 * on pages. You can replace 'page' with your desired post type.
	 *
	 * @param boolean $display
	 * @return boolean
	 */
	public function remove_media_button( $display ) {
return;
		$screen = get_current_screen();

		if ( 'page' == $screen->post_type ) {
			return false;
		}

		return $display;
	}

	/**
	 * Create Tabs based on configurations
	 *
	 */
	public function create_tabs() {
		require_once dirname( __FILE__ ) .
			'/../../class-boldgrid-editor-forms-media-tab.php';

		require_once dirname( __FILE__ ) .
			 '/../../class-boldgrid-editor-forms-media.php';

		$boldgrid_configs = $this->get_tab_configs();

		$configs = $boldgrid_configs['tabs'];

		/**
		 * Create each tab specified from the configuration.
		 */
		foreach ( $configs as $tab ) {
			$media_tab = new Boldgrid_Editor_Forms_Media_Tab( $tab, $this->get_path_configs(), '/boldgrid' );
			$media_tab->create();
		}
	}

	/**
	 * Get Templates for all forms and print them to the page
	 *
	 * @return void
	 */
	public function print_media_templates() {
		$form_markup = array ();

		$forms = self::get_forms();

		foreach ( $forms as $form ) {
			$form_markup[$form['id']] = self::get_form_markup( $form['id'] );
		}

		include BOLDGRID_NINJA_FORMS_PATH . '/boldgrid/includes/partial-page/form-not-found-tmpl.php';

		foreach ( $form_markup as $form_id => $markup ) {
			$markup = str_replace( '<script', '<# print("<sc" + "ript"); #>', $markup );
			$markup = str_replace( '</script>', '<# print("</scr" + "ipt>"); #>', $markup );

			?>
<script type="text/html"
	id="tmpl-editor-boldgrid-form-<?php echo $form_id; ?>">
			<?php echo '<div>' . $markup . '</div>';  ?>
			</script>
<?php
		}
	}

}
