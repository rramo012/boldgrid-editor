<?php
/**
 * Class: Boldgrid_Editor_Builder
 *
 * Add functionality for fully customizable editor pages.
 *
 * @since      1.2
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Builder
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Builder
 *
 * Add functionality for fully customizable editor pages.
 *
 * @since      1.2
 */
class Boldgrid_Editor_Builder {

	/**
	 * Enqueue Styles.
	 *
	 * @since 1.2.3
	 */
	public function enqueue_styles() {
		wp_enqueue_style( 'genericons-imhwpb' );
		wp_enqueue_style( 'font-awesome' );
	}

	/**
	 * Get configuration to be used in the page styler.
	 *
	 * @since 1.2.3
	 *
	 * @return array Configs for the styler.
	 */
	public static function get_builder_config() {
		$fonts = new Boldgrid_Editor_Builder_Fonts();

		$builder_configs = json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/builder.json' ), true );
		$builder_configs['fonts'] = json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/webfonts.json' ), true );
		$builder_configs['theme_fonts'] = $fonts->get_theme_fonts();
		$builder_configs['theme_features'] = self::get_theme_features();
		return $builder_configs;
	}

	/**
	 * Get a list of supported theme features.
	 *
	 * @global array $boldgrid_theme_framework.
	 *
	 * @since 1.2.5
	 *
	 * @return array $supported_features.
	 */
	public static function get_theme_features() {
		global $boldgrid_theme_framework;

		$configs = $boldgrid_theme_framework->get_configs();
		$supported_features = ! empty( $configs['supported-features'] ) ?
			$configs['supported-features'] : array();

		/*
		 * supported-features was added after support for variable containers.
		 * for the period between 1.2 and 1.3 this conditional should trigger, overriding
		 * supported features to add 1 more entry.
		 */
		if ( empty( $configs['supported-features']['variable-containers'] ) ) {
			if ( isset( $configs['template']['pages'] ) || ! empty( $configs['supported-features'] ) ) {
				$supported_features[] = 'variable-containers';
			}
		}

		return $supported_features;
	}

	/**
	 * Print templates used in page and post editor.
	 *
	 * @since 1.2.3
	 */
	public function print_scripts() {
		$template_path = BOLDGRID_EDITOR_PATH . '/includes/template';

		print include $template_path . '/button.php';
		print include $template_path . '/image.php';
		print include $template_path . '/image-filter.php';
		print include $template_path . '/color.php';
		print include $template_path . '/font.php';
		print include $template_path . '/background.php';
		print include $template_path . '/box.php';
		print include $template_path . '/panel.php';
		print include $template_path . '/drag-handles.php';
	}

	/**
	 * Get configuration to be used in the page styler.
	 *
	 * @since 1.2.3
	 *
	 * @return array Pattern image data.
	 */
	public static function get_patterns() {
		$patterns = scandir( BOLDGRID_EDITOR_PATH . '/assets/image/patterns' );
		$patterns = array_diff( $patterns, array( '..', '.' ) );

		$pattern_data = array();
		foreach ( $patterns as $pattern ) {
			$pattern_data[] = plugins_url( '/assets/image/patterns/' . $pattern, BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php');
		}

		return $pattern_data;
	}

	/**
	 * Get configurations of assets.
	 *
	 * @return array Configurations.
	 */
	public static function get_background_data() {
		return array(
			'color' => array(),
			'image' => json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/sample-images.json' ) ),
			'pattern' => self::get_patterns(),
			//'default_gradients' =>  json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/gradients.json' ) ),
			'gradients' => json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/preset-gradients.json' ) )
		);
	}

	/**
	 * Get images used on the current post.
	 *
	 * @since 1.2.3
	 *
	 * @param integer $post_id.
	 * @return array $image_lookups
	 */
	public static function get_post_images( $post_id = null ) {
		$request_post = ! empty( $_REQUEST['post'] ) ? intval( $_REQUEST['post'] ) : false;
		$current_post_id = $post_id ? $post_id : $request_post;

		if ( ! $current_post_id ) {
			return array();
		}

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
	 * Print inputs that will be stored when the page is saved.
	 *
	 * @since 1.3
	 */
	public function post_inputs () {
		$custom_colors = self::get_editor_option( 'custom_colors', array() );
		$custom_colors_encoded = json_encode( $custom_colors );

		echo <<<HTML
		<input style='display:none' type='checkbox' value='1' checked='checked' name='boldgrid-in-page-containers'>
		<input style='display:none' type='checkbox' value='$custom_colors_encoded' checked='checked' name='boldgrid-custom-colors'>
HTML;
	}

	/**
	 * Save page meta info.
	 *
	 * Once a page has been converted to use in page containers, set the post meta data so that
	 * containers can be removed from the theme.
	 *
	 * @since 1.3
	 *
	 * @param string $post_id integer.
	 * @param mixed $post WP_Post.
	 */
	public function save_container_meta( $post_id, $post ) {
		$post_id = ! empty( $post_id ) ? $post_id : null;

		// If this is a revision, get real post ID.
		if ( $parent_id = wp_is_post_revision( $post_id ) ) {
			$post_id = $parent_id;
		}

		$status = isset( $_POST['boldgrid-in-page-containers'] ) ? intval( $_POST['boldgrid-in-page-containers'] ) : null;
		if ( $post_id && false === is_null( $status ) ) {
			$post_meta = get_post_meta( $post_id );
			if ( ! empty( $post_meta ) ) {
				// Save post meta.
				update_post_meta( $post_id, 'boldgrid_in_page_containers', $status );
			}
		}
	}

	/**
	 * Retreive an option from the stored list of editor options.
	 *
	 * @since 1.3
	 *
	 * @param string $key Index of value.
	 * @param mixed $default Default value if not found.
	 */
	public static function get_editor_option( $key, $default = null ) {
		$boldgrid_editor = get_option( 'boldgrid_editor', array() );
		return ! empty( $boldgrid_editor[ $key ] ) ? $boldgrid_editor[ $key ] : $default;
	}

	/**
	 * Store an option for the plugin in a single option.
	 *
	 * @since 1.3
	 *
	 * @param string $key Name of value of value.
	 * @param mixed $value Value to store.
	 */
	public static function update_editor_option( $key, $value ) {
		$boldgrid_editor = get_option( 'boldgrid_editor', array() );
		$boldgrid_editor[ $key ] = $value;
		update_option( 'boldgrid_editor', $boldgrid_editor );
	}

	/**
	 * Sanatize colors field passed back from page and post.
	 *
	 * @since 1.3
	 *
	 * @param string $colors.
	 *
	 * @return string json string.
	 */
	public function sanitize_custom_colors( $colors ) {
		return strip_tags( $colors );
	}

	/**
	 * Save user colors created during edit process.
	 *
	 * @since 1.3
	 */
	public function save_colors() {
		$custom_colors = ! empty ( $_POST['boldgrid-custom-colors'] ) ? $_POST['boldgrid-custom-colors'] : '';
		$custom_colors = $this->sanitize_custom_colors( $custom_colors );
		$custom_colors = json_decode( stripcslashes( $custom_colors ), true );
		$custom_colors = is_array( $custom_colors ) ? $custom_colors : array();
		self::update_editor_option( 'custom_colors', $custom_colors );
	}

	public static function get_page_container() {
		global $boldgrid_theme_framework;
		global $post;

		$container = 'container-fluid';

		if ( $boldgrid_theme_framework && ! empty( $post->ID ) ) {

			$slug = get_page_template_slug( $post->ID );
			$slug = $slug ? $slug : 'default';

			$configs = $boldgrid_theme_framework->get_configs();

			if ( !empty( $configs['template']['pages'][ $slug ]['entry-content'] ) ) {
				$container = $configs['template']['pages'][ $slug ]['entry-content'];
			}
		}

		return $container;
	}

}