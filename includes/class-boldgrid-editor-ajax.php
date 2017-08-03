<?php
/**
 * Class: Boldgrid_Editor_Ajax
 *
 * Ajax calls used in the plugin.
 *
 * @since      1.2
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Ajax
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Ajax
 *
 * Ajax calls used in the plugin.
 *
 * @since      1.2
 */
class Boldgrid_Editor_Ajax {

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
	 * Validate image nonce.
	 *
	 * @since 1.5
	 */
	public function validate_image_nonce() {
		$nonce = ! empty( $_POST['boldgrid_gridblock_image_ajax_nonce'] ) ?
			$_POST['boldgrid_gridblock_image_ajax_nonce'] : null;

		$valid = wp_verify_nonce( $nonce, 'boldgrid_gridblock_image_ajax_nonce' );

		if ( ! $valid ) {
			status_header( 401 );
			wp_send_json_error();
		}
	}

	/**
	 * Get a redirect url. Used for unsplash images.
	 *
	 * @since 1.5
	 */
	public function get_redirect_url() {
		$urls = ! empty( $_POST['urls'] ) ? $_POST['urls'] : null;

		$this->validate_image_nonce();

		$redirectUrls = array();
		foreach( $urls as $url ) {
			$response = wp_remote_head( $url );
			$headers = ! empty( $response['headers'] ) ? $response['headers']->getAll() : array();
			$redirectUrl = ! empty( $headers['location'] ) ? $headers['location'] : false;
			$redirectUrls[ $url ] = $redirectUrl;
		}

		if ( ! empty( $redirectUrls ) ) {
			wp_send_json_success( $redirectUrls );
		} else {
			status_header( 400 );
			wp_send_json_error();
		}
	}

	/**
	 * Ajax Call upload image.
	 *
	 * Works with base64 encoded image or a url.
	 *
	 * @since 1.5
	 */
	public function upload_image_ajax() {
		$response = array();
		$image_data = ! empty( $_POST['image_data'] ) ? $_POST['image_data'] : null;

		$this->validate_image_nonce();

		if ( $this->is_base_64( $image_data ) ) {
			$response = $this->upload_encoded( $image_data );
		} else {
			$response = $this->upload_url( $image_data );
		}

		if ( ! empty( $response['success'] ) ) {
			unset( $response['success'] );
			wp_send_json_success( $response );
		} else {
			status_header( 400 );
			wp_send_json_error();
		}
	}

	/**
	 * Check if a given image src is a base 64 representation.
	 *
	 * @since 1.5
	 *
	 * @param  string  $url Image src.
	 * @return boolean      Whether or not the image is encoded.
	 */
	public function is_base_64( $url ) {
		preg_match ( '/^data/', $url, $matches );
		return ! empty( $matches[0] );
	}

	/**
	 * Given a URL, attach the image to the current post.
	 *
	 * @since 1.5
	 *
	 * @param  string $image_data URL to the remote image.
	 * @return array              Results of the upload.
	 */
	public function upload_url( $image_data ) {
		global $post;

		$attachment_id = media_sideload_image( $image_data . '&.png', $post->ID, null, 'id' );

		$results = array();
		if ( ! is_object( $attachment_id ) ) {
			$results = array(
				'success' => true,
				'url' => wp_get_attachment_url( $attachment_id ),
				'attachment_id' => $attachment_id,
			);
		}

		return $results;
	}

	/**
	 * Save Image data to the media library.
	 *
	 * @since 1.2.3
	 *
	 * @param string $_POST['image_data'].
	 * @param integer $_POST['attachement_id'].
	 */
	public function upload_encoded( $image_data ) {
		$attachement_id = ! empty( $_POST['attachement_id'] ) ? (int) $_POST['attachement_id'] : null;

		// Validate nonce
		$valid = wp_verify_nonce( $_POST['boldgrid_gridblock_image_ajax_nonce'],
			'boldgrid_gridblock_image_ajax_nonce' );

		if ( false === $valid ) {
			wp_die( - 1 );
		}

		$original_attachment = ( array ) get_post ( $attachement_id );

		$pattern = '/^data:(.*?);base64,/';
		preg_match ( $pattern, $image_data, $matches );
		$image_data = preg_replace( $pattern, '', $image_data );
		$mimeType = ! empty( $matches[1] ) ? $matches[1] : 'image/png';
		$extension = explode( '/', $mimeType );
		$extension = ! empty( $extension[1] ) ? $extension[1] : 'png';

		$image_data = str_replace( ' ', '+', $image_data );
		$data = base64_decode( $image_data );

		$filename = uniqid() . '.' . $extension;
		$uploaded = wp_upload_bits( $filename, null, $data );

		$response = array( 'success' => false );
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
				$attach_data = wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] );
				$result = wp_update_attachment_metadata( $attachment_id, $attach_data );

				$response = array(
					'success' => true,
					'attachment_id' => $attachment_id,
					'url' => $uploaded['url'],
					'images' => Boldgrid_Editor_Builder::get_post_images( $original_attachment['post_parent'] ),
				);
			}
		}

		return $response;
	}

}
