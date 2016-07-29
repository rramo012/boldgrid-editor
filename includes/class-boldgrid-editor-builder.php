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

	public static function get_menu_markup() {
		return file_get_contents( BOLDGRID_EDITOR_PATH . '/includes/temp.html' );
	}

	public static function get_popup_markup() {
		return file_get_contents( BOLDGRID_EDITOR_PATH . '/includes/popup.html' );
	}

	public function enqueue_styles() {
		wp_enqueue_style( 'genericons-imhwpb' );
		wp_enqueue_style( 'font-awesome' );
	}

	public static function get_patterns() {
		$patterns = scandir( BOLDGRID_EDITOR_PATH . '/assets/image/patterns' );
		$patterns = array_diff( $patterns, array( '..', '.' ) );

		$pattern_data = array();
		foreach ( $patterns as $pattern ) {
			$pattern_data[] = plugins_url( '/assets/image/patterns/' . $pattern, BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php');
		}

		return $pattern_data;
	}

	public static function get_sample_images() {
		return json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/includes/template/sample-images.json' ) );
	}

	public static function get_sample_gradients() {
		return json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/includes/template/gradients.json' ) );
	}

	public static function get_builder_config() {
		return json_decode( file_get_contents ( BOLDGRID_EDITOR_PATH . '/assets/json/builder.json' ) );
	}

	public static function get_background_data() {
		return array(
			'image' => self::get_sample_images(),
			'pattern' => self::get_patterns(),
			'gradients' => self::get_sample_gradients(),
		);
	}

	public function print_scripts() {
		print include BOLDGRID_EDITOR_PATH . '/includes/template/button.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/image.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/image-filter.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/color.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/font.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/background.php';
		print include BOLDGRID_EDITOR_PATH . '/includes/template/box.php';
	}

	public static function get_post_images( $post_id = null ) {
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
}