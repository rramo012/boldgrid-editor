<?php
/**
 * Class: Boldgrid_Editor_MCE
 *
 * Override and extend the functionality of tinyMCE.
 *
 * @since      1.2
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_MCE
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_MCE
 *
 * Override and extend the functionality of tinyMCE.
 *
 * @since      1.2
 */
class Boldgrid_Editor_MCE {

	/**
	 * Add Help Pointer to Boldgrid Editing.
	 *
	 * @since 1.0
	 */
	public function help_pointers() {
		// Dont add the help pointer if this is a boldgrid theme
		if ( Boldgrid_Editor_Theme::is_editing_boldgrid_theme() ) {
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
	public static function has_draggable_enabled() {
		return get_theme_mod( 'boldgrid_draggable_enabled', Boldgrid_Editor_Theme::is_editing_boldgrid_theme() );
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
	 * Adding tinyMCE plugins
	 *
	 * @param array $plugin_array
	 * @return array
	 */
	public function add_tinymce_plugin( $plugin_array ) {
		$editor_js_file = plugins_url( Boldgrid_Editor_Assets::get_minified_js( '/assets/js/editor/editor' ),
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
	 * Add Extended valid elements
	 *
	 * @param array | string $init
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

}
