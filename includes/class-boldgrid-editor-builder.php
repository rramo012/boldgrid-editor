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
		return json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/builder.json' ) );
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
			'gradients' => json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/gradients.json' ) )
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
}