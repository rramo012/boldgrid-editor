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
	 * Save Image data to the media library.
	 *
	 * @since 1.2.3
	 *
	 * @param string $_POST['image_data'].
	 * @param integer $_POST['attachement_id'].
	 */
	public function upload_canvas_ajax() {
		$image_data = ! empty( $_POST['image_data'] ) ? $_POST['image_data'] : null;
		$attachement_id = ! empty( $_POST['attachement_id'] ) ? (int) $_POST['attachement_id'] : null;

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
					'images' => Boldgrid_Editor_Builder::get_post_images( $original_attachment['post_parent'] )
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
}
