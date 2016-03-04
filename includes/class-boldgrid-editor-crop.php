<?php

/**
 * BoldGrid Editor Crop.
 *
 * This class helps manage the 'suggest crop' feature, a feature that suggests a user crop an image
 * when they're replacing images with different aspect ratios.
 *
 * @since 1.0.8
 */
class Boldgrid_Editor_Crop {
	/**
	 * Should the 'suggest crop' feature be loaded?
	 *
	 * @since 1.0.8
	 * @access public
	 * @var bool $should_be_loaded Set in the constructor.
	 */
	public $should_be_loaded = false;
	
	/**
	 * Constructor.
	 *
	 * @since 1.0.8
	 *       
	 * @global string $pagenow;
	 */
	public function __construct() {
		global $pagenow;
		
		$valid_pages = array (
			'post.php',
			'post-new.php',
			'media-upload.php' 
		);
		
		$this->should_be_loaded = in_array( $pagenow, $valid_pages );
	}
	
	/**
	 * Add hooks.
	 *
	 * @since 1.0.8
	 */
	public function add_hooks() {
		if ( is_admin() ) {
			add_action( 'admin_enqueue_scripts', 
				array (
					$this,
					'admin_enqueue_scripts' 
				) );
			
			add_action( 'admin_footer', array (
				$this,
				'admin_footer' 
			) );
		}
		
		add_action( 'wp_ajax_suggest_crop_crop', array (
			$this,
			'crop' 
		) );
		
		add_action( 'wp_ajax_suggest_crop_get_dimensions', 
			array (
				$this,
				'get_dimensions' 
			) );
	}
	
	/**
	 * Enqueue scripts.
	 *
	 * @since 1.0.8
	 */
	public function admin_enqueue_scripts() {
		if ( $this->should_be_loaded ) {
			$plugin_file = BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php';
			
			wp_enqueue_script( 'boldgrid-editor-suggest-crop', 
				plugins_url( '/assets/js/crop.js', $plugin_file ), array (), 
				BOLDGRID_EDITOR_VERSION, true );
			
			wp_enqueue_style( 'boldgrid-editor-css-suggest-crop', 
				plugins_url( '/assets/css/crop.css', $plugin_file ), array (), 
				BOLDGRID_EDITOR_VERSION );
		}
	}
	
	/**
	 * Admin footer.
	 *
	 * @since 1.0.8
	 */
	public function admin_footer() {
		if ( $this->should_be_loaded ) {
			require_once BOLDGRID_EDITOR_PATH . '/pages/templates/crop.php';
		}
	}
	
	/**
	 * Get all available sizes for an attachment id.
	 *
	 * @since 1.0.9
	 *       
	 * @return array dimensions Example: http://pastebin.com/UamKiXS4
	 */
	public function get_dimensions() {
		// Validate our attachment id.
		if ( empty( $_POST['attachment_id'] ) ) {
			wp_die( 0 );
		}
		
		$attachment_id = $_POST['attachment_id'];
		
		$dimensions = wp_get_attachment_metadata( $attachment_id );
		
		// Validate our dimensions.
		if ( false === $dimensions ) {
			wp_die( 0 );
		}
		
		foreach ( $dimensions['sizes'] as $size => $size_array ) {
			$image_src = wp_get_attachment_image_src( $attachment_id, $size );
			
			$dimensions['sizes'][$size]['url'] = $image_src[0];
		}
		
		// Add our original size to the dimensions as well.
		$dimensions['sizes']['original'] = array (
			'file' => $dimensions['file'],
			'width' => $dimensions['width'],
			'height' => $dimensions['height'],
			'url' => wp_get_attachment_url( $attachment_id ) 
		);
		
		echo json_encode( $dimensions );
		
		wp_die();
	}
	
	/**
	 * Crop an image.
	 *
	 * This method is called via an AJAX request.
	 *
	 * Example $_POST on a valid call: http://pastebin.com/YbZ12mLK
	 *
	 * @since 1.0.8
	 */
	public function crop() {
		// Validate $_POST['cropDetails'].
		if ( ! isset( $_POST['cropDetails'] ) || ! is_array( $_POST['cropDetails'] ) ) {
			echo 'Error: Invalid cropDetails.';
			wp_die();
		}
		
		// Validate $_POST['cropDetails'], again. Make sure all the values are numbers and positive.
		foreach ( $_POST['cropDetails'] as $int ) {
			if ( ! is_numeric( $int ) || $int < 0 ) {
				echo 'Error: Invalid cropDetail values.';
				wp_die();
			}
		}
		
		// Example $cropDetails: http://pastebin.com/yfkg9XCJ
		$cropDetails = $_POST['cropDetails'];
		
		// Validate $_POST['path'].
		if ( ! isset( $_POST['path'] ) ) {
			echo 'Error: path.';
			wp_die();
		} else {
			// Example $path: https://domain.com/wp-content/uploads/2016/01/image.jpg
			$path = $_POST['path'];
		}
		
		// Example $site_url: https://domain.com
		$site_url = get_site_url();
		
		// Example $path_to_image: /home/user/public_html/wp-content/uploads/2016/01/image.jpg
		$path_to_image = ABSPATH . ( str_replace( $site_url . '/', '', $path ) );
		
		// If we couldn't fine the file, abort.
		if ( ! is_file( $path_to_image ) ) {
			echo 'Error: unable to find path to image.';
			wp_die();
		}
		
		$new_image = wp_get_image_editor( $path_to_image );
		
		// Crop the image.
		$successful_crop = $new_image->crop( $cropDetails['x1'], $cropDetails['y1'], 
			$cropDetails['width'], $cropDetails['height'] );
		
		// If we failed to crop the image, abort.
		if ( false === $successful_crop ) {
			echo 'Error: failed to crop image.';
			wp_die();
		}
		
		// Example $new_image_path_parts: http://pastebin.com/b1477tYa
		$original_image_path_parts = pathinfo( $path_to_image );
		
		// Example $new_image_basename = x1_y1_width_height_image.jpg
		$new_image_basename = $cropDetails['x1'] . '_' . $cropDetails['y1'] . '_' .
			 $cropDetails['width'] . '_' . $cropDetails['height'] . '_' .
			 $original_image_path_parts['basename'];
		
		// Example $new_image_path:
		// /home/user/public_html/wp-content/uploads/2016/01/x1_x2_width_height_image.jpg
		$new_image_path = $original_image_path_parts['dirname'] . '/' . $new_image_basename;
		
		$new_image_url = str_replace( $original_image_path_parts['basename'], $new_image_basename, 
			$path );
		
		// Example $successful_save: http://pastebin.com/e0Hvt8gq
		$successful_save = $new_image->save( $new_image_path );
		
		// If we didn't save the new image successfully, abort.
		if ( is_wp_error( $successful_save ) ) {
			echo 'Error: unable to save cropped image.';
			wp_die();
		}
		
		echo json_encode( 
			array (
				'new_image_url' => $new_image_url,
				'new_image_width' => $cropDetails['width'],
				'new_image_height' => $cropDetails['height'] 
			) );
		
		wp_die();
	}
}

?>