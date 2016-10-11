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
		// Dont add the help pointer if this is a boldgrid theme.
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
	 *
	 * @since 1.1.
	 */
	public function load_editor_hooks() {
		echo '<button type="button" id="insert-gridblocks-button" class="button gridblock-icon">' .
			'<span class="wp-media-buttons-icon"></span> Add GridBlock</button>';
	}

	/**
	 * Adding tinyMCE buttons
	 *
	 * @since 1.0.
	 */
	public function add_window_size_buttons() {
		add_action( 'admin_head', array (
			$this,
			'add_mce_buttons'
		) );
	}

	/**
	 * Procedure for adding new buttons.
	 *
	 * @global $typenow.
	 *
	 * @since 1.0.
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
	 * Adding tinyMCE plugins.
	 *
	 * @since 1.0.
	 *
	 * @param array $plugin_array.
	 *
	 * @return array.
	 */
	public function add_tinymce_plugin( $plugin_array ) {
		$file = Boldgrid_Editor_Assets::get_minified_js( '/assets/js/editor/editor' );
		$file = $file . '?ver=' . BOLDGRID_EDITOR_VERSION;
		$editor_js_file = plugins_url( $file, BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$plugin_array['monitor_view_imhwpb'] = $editor_js_file;
		$plugin_array['tablet_view_imhwpb'] = $editor_js_file;
		$plugin_array['phone_view_imhwpb'] = $editor_js_file;
		$plugin_array['toggle_draggable_imhwpb'] = $editor_js_file;

		return $plugin_array;
	}

	/**
	 * Registering new buttons.
	 *
	 * @since 1.0.
	 *
	 * @param array $buttons.
	 *
	 * @return array.
	 */
	public function register_mce_button( $buttons ) {
		array_push( $buttons, 'monitor_view_imhwpb' );
		array_push( $buttons, 'tablet_view_imhwpb' );
		array_push( $buttons, 'phone_view_imhwpb' );
		array_push( $buttons, 'toggle_draggable_imhwpb' );

		return $buttons;
	}

	/**
	 * Add Extended valid elements.
	 *
	 * @since 1.2.7.
	 *
	 * @param array | string $init.
	 *
	 * @return array.
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

		// Note: Using .= here can trigger a fatal error.
		$init['extended_valid_elements'] = $init['extended_valid_elements'] . implode( ',', $extra_tags );

		// Always show wordpress 2 toolbar.
		$init['wordpress_adv_hidden'] = false;

		return $init;
	}

	/**
	 * If a bootstrap css file does not already exists in the list of css files, enqueue it.
	 *
	 * @since 1.2.7
	 *
	 * @param array $styles
	 *
	 * @return array
	 */
	public function prepend_bootstrap_styles( $styles ) {

		$boostrap_included = false;
		foreach ( $styles as $style ) {
			if ( -1 !== stripos( $style, 'bootstrap.min.css' ) ) {
				$boostrap_included = true;
			}
		}

		if ( ! $boostrap_included ) {
			array_unshift( $styles, plugins_url( '/assets/css/bootstrap.min.css',
				BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ) );
		}

		return $styles;
	}

	/**
	 * If a css file does not already exists in the list of css files, enqueue it.
	 *
	 * @since 1.3
	 *
	 * @param array $styles
	 *
	 * @return array
	 */
	public function add_styles_conflict( $styles ) {

		$conditional_styles = array(
			'/components.' => '/assets/css/components.min.css',
			'/font-awesome.' => '/assets/css/font-awesome.min.css',
		);

		foreach( $conditional_styles as $check => $conditional_style ) {

			$included = false;
			foreach ( $styles as $style ) {
				if ( false !== stripos( $style, $check ) ) {
					$included = true;
				}
			}

			if ( ! $included ) {
				$styles[] = plugins_url( $conditional_style, BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );
			}

		}

		return $styles;
	}

	/**
	 * Add an additional query arg to each css file included in the tinymce iframe.
	 * E.g. boldgrid-editor-version=1.0.0.
	 *
	 * @since 1.0.2
	 *
	 * @param string $css.
	 *
	 * @return string.
	 */
	public function add_cache_busting( $css ) {
		if ( empty( $css ) ) {
			return $css;
		}

		$styles = explode( ',', $css );

		$styles = $this->prepend_bootstrap_styles( $styles );

		array_unshift( $styles, plugins_url( '/assets/js/builder/css/before-theme.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ) );
		array_unshift( $styles, '//fonts.googleapis.com/css?family=Open+Sans:600' );

		// Add a couple of styles that need to append the iframe head.
		$styles[] = plugins_url( '/assets/css/genericons.min.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$styles[] = plugins_url( '/assets/js/builder/css/draggable.css',
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		$styles[] = plugins_url( Boldgrid_Editor_Assets::get_minified_js('/assets/css/editor', '.css'),
			BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );

		if ( ! Boldgrid_Editor_Theme::is_editing_boldgrid_theme() ) {
			$styles[] = plugins_url( '/assets/css/buttons.min.css',
				BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' );
		}

		// Add styles that could conflict.
		$styles = $this->add_styles_conflict( $styles );

		// Add Query Args.
		$mce_css = array ();
		foreach ( $styles as $editor_style ) {
			$mce_css[] = add_query_arg( 'boldgrid-editor-version', BOLDGRID_EDITOR_VERSION,
				$editor_style );
		}

		return implode( ',', $mce_css );
	}

}
