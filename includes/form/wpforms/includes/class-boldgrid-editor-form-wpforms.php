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
	 *
	 * @since 1.4.4
	 */
	public function initiallizeConfigs() {
		$addonDir = dirname( __FILE__ );
		$this->tab_configs = include( $addonDir . '/config/layouts.php' );

		$this->path_configs = array (
			'plugin_dir' => BOLDGRID_EDITOR_PATH,
			'addon_directory' => realpath( dirname( __FILE__ ) . '/..'),
			'plugin_filename' => BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php'
		);
	}

	/**
	 * Javascript needed for editor.
	 *
	 * @since 1.4.4
	 */
	public function enqueue_header_content() {
		global $pagenow;

		if ( false == in_array( $pagenow, array (
			'post.php',
			'post-new.php'
		) ) ) {
			return;
		}

		wp_enqueue_script( 'boldgrid-form-shortcode',
			plugins_url( '/wpforms/assets/js/shortcode.js', $this->path_configs['addon_directory'] ),
			array (), BOLDGRID_EDITOR_VERSION, true );
	}

	/**
	 * Initialization hook for BoldGrid Ninja forms.
	 *
	 * @since 1.4.4
	 */
	public function init() {
		add_action( 'admin_init', array ( $this, 'admin_init' ) );
	}

	/**
	 * Check if wp forms is active and has enough functionality for us to support it.
	 *
	 * The constant checks are deps we use in the plugin.
	 *
	 * @since 1.44
	 *
	 * @return boolean Is WP forms active and supportable?
	 */
	public function isWpformsActive() {
		return function_exists('wpforms') && defined('WPFORMS_PLUGIN_URL')
			&& defined('WPFORMS_VERSION') && ! defined('BOLDGRID_NINJA_FORM_VERSION');
	}

	/**
	 * Initialization process for administration section of forms.
	 *
	 * @since 1.4.4
	 */
	public function admin_init() {
		if ( ! $this->isWpformsActive() ) {
			return;
		}

		$valid_pages = array (
			'post.php',
			'post-new.php',
			'media-upload.php'
		);

		$edit_post_page = in_array( basename( $_SERVER['SCRIPT_NAME'] ), $valid_pages );
		if ( is_admin() && $edit_post_page ) {

			// Create Media Modal Tabs
			$this->initiallizeConfigs();
			$this->create_tabs();

			// Print all forms as media templates
			add_action( 'print_media_templates', array ( $this, 'print_media_templates' ) );
			add_filter( 'wpforms_display_media_button', array( $this, 'remove_media_button' ) );

			// load up any css / js we need
			add_action( 'admin_enqueue_scripts', array ( $this, 'enqueue_header_content' ), 15 );
			add_editor_style( WPFORMS_PLUGIN_URL . 'assets/css/wpforms-full.css' );
		}
	}

	/**
	 * Get form markup.
	 *
	 * @since 1.4.4
	 *
	 * @param int $form_id ID of Form.
	 * @return string Markup of form.
	 */
	public static function get_form_markup( $form_id ) {
		return do_shortcode( '[wpforms id="' . $form_id . '"]' );
	}

	/**
	 * Get all wpforms.
	 *
	 * @since 1.4.4
	 *
	 * @return array
	 */
	public static function get_forms() {
		$results = get_posts( ['post_type' => 'wpforms'] );

		// Initialize $form_ids array.
		$form_ids = array();

		// Populate the $form_ids array.
		foreach ( $results as $result ) {
			if ( ! empty( $result->ID ) ) {
				$form_ids[] = array (
					'id' => $result->ID
				);
			}
		}

		// Return the resulting array.
		return $form_ids;
	}

	/**
	 * Remove the WPForms TinyMCE media button.
	 *
	 * In the function below we disable displaying the media button
	 * on pages. You can replace 'page' with your desired post type.
	 *
	 *  @since 1.4.4
	 *
	 * @param boolean $display
	 * @return boolean
	 */
	public function remove_media_button( $display ) {
		$screen = get_current_screen();

		if ( 'page' == $screen->post_type ) {
			return false;
		}

		return $display;
	}

	/**
	 * Create Tabs based on configurations.
	 *
	 * @since 1.4.4
	 */
	public function create_tabs() {
		require_once dirname( __FILE__ ) . '/class-boldgrid-editor-form-media.php';

		$boldgrid_configs = $this->get_tab_configs();

		$configs = $boldgrid_configs['tabs'];

		/*
		 * Create each tab specified from the configuration.
		 */
		foreach ( $configs as $tab ) {
			$media_tab = new Boldgrid_Editor_Form_Media( $tab, $this->get_path_configs(), '/' );
			$media_tab->create();
		}
	}

	/**
	 * Get Templates for all forms and print them to the page.
	 *
	 * @since 1.4.4
	 */
	public function print_media_templates() {
		$form_markup = array ();

		$forms = self::get_forms();

		foreach ( $forms as $form ) {
			$form_markup[$form['id']] = self::get_form_markup( $form['id'] );
		}

		require $this->path_configs['addon_directory'] . '/templates/form-not-found.php';

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
