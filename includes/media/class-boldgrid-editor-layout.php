<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Layout
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */
class Boldgrid_Layout extends Boldgrid_Editor_Media_Tab {

	/**
	 * Post status for active pages
	 *
	 * @var array
	 */
	private static $active_pages = array (
		'publish',
		'draft'
	);

	/**
	 * Post Status for staged pages
	 *
	 * @var array
	 */
	private static $staged_pages = array (
		'staging'
	);

	/**
	 * Sort by integer
	 *
	 * @return number
	 */
	public function sort_by_order( $a, $b ) {
		return $b['str_length'] - $a['str_length'];
	}

	/**
	 * Print outerHTML from DOMElements.
	 *
	 * @since 1.0.5.
	 * @param DOMElement $e.
	 * @return string DOMElements HTML.
	 */
	public static function outer_HTML( $e ) {
		$doc = new DOMDocument();
		$doc->appendChild( $doc->importNode( $e, true ) );
		return $doc->saveHTML();
	}

	/**
	 * Take a string of HTML and return the divs with the class row
	 *
	 * @param array $content
	 * @since 1.0.5
	 *
	 * @return array $row_content
	 */
	public static function parse_gridblocks( $content ) {
		global $shortcode_tags;

		$dom = new DOMDocument();

		@$dom->loadHTML( self::utf8_to_html( $content ) );

		$div = $dom->getElementsByTagName( 'div' );

		$rows = array ();
		foreach ( $div as $potential_row ) {
			$classes_attr = $potential_row->getAttribute( 'class' );

			if ( preg_match( '/boldgrid-section(\s|$)/', $classes_attr ) &&
				 ! preg_match( '/hidden-md/', $classes_attr ) ) {

				// Save Markup
				$row_html = self::outer_HTML( $potential_row );

				// If a shortcode exists, Ignore the row
				foreach ( $shortcode_tags as $tag => $details ) {
					if ( has_shortcode( $row_html, $tag ) ) {
						continue 2;
					}
				}

				// In the future we could translate the shortcodes and display them
				// $shortcode_translated_html = do_shortcode( $row_html );
				$shortcode_translated_html = wpautop( $row_html );

				$rows[] = array (
					'html' => $shortcode_translated_html,
					'preview-html' => $shortcode_translated_html,
					'str_length' => strlen( $shortcode_translated_html )
				);
			}
		}

		return $rows;
	}

	/**
	 * Sort the gridblocks by content length
	 *
	 * @param array $row_content
	 * @return array $row_content
	 */
	public static function sort_gridblocks( $row_content ) {
		$sort_by_order = function ( $a, $b ) {
			return $b['str_length'] - $a['str_length'];
		};

		// Sort by longest
		if ( count( $row_content ) ) {
			usort( $row_content, $sort_by_order );
		}

		return $row_content;
	}

	/**
	 * Filters out all nested rows from gridblocks
	 *
	 * @param array $row_content
	 * @since 1.0.5
	 * @return array $updated_row_content
	 */
	public static function remove_nested_rows( $row_content ) {
		/**
		 * Check if given row is nested
		 */
		$nested_row_check = function ( $row ) use($row_content ) {
			$is_nested_row = false;
			foreach ( $row_content as $existing_row ) {

				if ( false !== strpos( $existing_row['html'], $row['html'] ) &&
					 $existing_row['html'] != $row['html'] ) {
					$is_nested_row = true;
					break;
				}
			}

			return $is_nested_row;
		};

		// Move all rows that are not nested into a new array
		$updated_row_content = array ();
		foreach ( $row_content as $row ) {

			if ( false == $nested_row_check( $row ) ) {
				$updated_row_content[] = $row;
			}
		}

		return $updated_row_content;
	}

	/**
	 * Remove all duplicate gridblocks from array
	 *
	 * @param array $row_content
	 * @since 1.0.5
	 * @return array $row_content
	 */
	public static function remove_duplicate_gridblocks( $row_content ) {
		// Remove Duplicates
		$temp = array ();

		foreach ( $row_content as $key => $row_content_element ) {
			$temp[$key] = $row_content_element['html'];
		}

		$temp = array_unique( $temp );
		if ( is_array( $temp ) ) {
			$row_content = array_intersect_key( $row_content, $temp );
		}

		return $row_content;
	}

	/**
	 * Get all pages with the BG statuses.
	 *
	 * @since 1.3
	 *
	 * @return array Pages and Posts.
	 */
	public static function get_pages_all_status() {
		$status = array_merge( self::$active_pages, self::$staged_pages );
		return self::get_pages( $status );
	}

	/**
	 * Get all pages and post.
	 *
	 * @since 1.3.
	 *
	 * @param array $status Acceptable page statuses.
	 *
	 * @return array pages.
	 */
	public static function get_pages( $status ) {
		$attribution_id = get_option( 'boldgrid_attribution', null );

		// Find Pages.
		$args = array (
			'post__not_in' => ! empty( $attribution_id['page']['id'] ) ? array( $attribution_id['page']['id'] ) : array(),
			'post_type' => array (
				'page',
				'post'
			),
			'post_status' => $status,
			'posts_per_page' => - 1
		);

		$results = new WP_Query( $args );

		return ! empty( $results->posts ) ? $results->posts : array();
	}

	/**
	 * Get all active pages. If current page is staging, only use staging pages.
	 *
	 * @since 1.3
	 *
	 * @param $_REQUEST['post_id']
	 *
	 * @return array
	 */
	public static function get_all_pages() {
		// Set the current post status.
		$post_id = ! empty( $_REQUEST['post_id'] ) ? $_REQUEST['post_id'] : null;
		$post = ! empty( $_REQUEST['post'] ) ? $_REQUEST['post'] : null;
		$post_id = ! empty( $post_id ) ? $post_id : $post;

		$current_post_status = get_post_status( intval( $post_id ) );

		// Set the Page Statuses to display.
		$page_statuses = self::$active_pages;

		if ( 'staging' === $current_post_status ) {
			$page_statuses = self::$staged_pages;
		}

		return self::get_pages( $page_statuses );
	}

	/**
	 * Add Existing layouts.
	 *
	 * @since 1.0
	 *
	 * @return array
	 */
	public static function get_existing_layouts() {

		$pages = self::get_all_pages();

		// Grab all rows from all pages.
		$row_content = array ();
		foreach ( $pages as $page ) {
			$row_content = array_merge( $row_content, self::parse_gridblocks( $page->post_content ) );
		}

		return $row_content;
	}

	/**
	 * Returns All universal gridblocks
	 *
	 * @since 1.0.5
	 */
	public static function get_universal_gridblocks( $gridblocks = array() ) {
		$dir = BOLDGRID_EDITOR_PATH . '/includes/layouts/universal';
		$dir_files = scandir( $dir );
		$dir_files = array_diff( $dir_files, array (
			'.',
			'..'
		) );

		$gridblocks = [];
		foreach ( $dir_files as $dir_file ) {
			$layout = $dir . '/' . $dir_file;
			$html = file_get_contents( $layout );
			$gridblocks[] = array (
				'id' => pathinfo( $layout, PATHINFO_FILENAME ),
				'html' => $html,
				'preview-html' => $html,
				'str_length' => strlen( $html )
			);
		}

		return $gridblocks;
	}

	/**
	 * Sort, Remove Duplicates, and remove nested row
	 *
	 * @since 1.0.6
	 */
	public static function cleanup_gridblock_collection( $row_content ) {
		// Update GridBlock array
		$row_content = self::sort_gridblocks( $row_content );
		$row_content = self::remove_duplicate_gridblocks( $row_content );
		$row_content = self::remove_nested_rows( $row_content );

		return $row_content;
	}

	/**
	 * Get page and universal Gridblocks
	 *
	 * @since 1.4
	 *
	 * @return array Gridblocks.
	 */
	public static function get_all_gridblocks() {
		$gridblocks = self::get_universal_gridblocks();
		$is_bg_theme = Boldgrid_Editor_Theme::is_editing_boldgrid_theme();

		if ( $is_bg_theme ) {
			$current_gridblock_content = self::get_existing_layouts();
			$gridblocks = array_merge ( $gridblocks, $current_gridblock_content );
		}

		return self::cleanup_gridblock_collection( $gridblocks );
	}

	/**
	 * Convert content encoding from "UTF-8" to "HTML-ENTITIES".
	 *
	 * If mbstring is not loaded in PHP then the input will be returned unconverted.
	 *
	 * @since 1.2.5
	 *
	 * @static
	 *
	 * @param string $input Content to be converted.
	 * @return string Content that may have been converted.
	 */
	public static function utf8_to_html( $input ) {
		if( function_exists( 'mb_convert_encoding' ) ){
			return mb_convert_encoding( $input, 'HTML-ENTITIES', 'UTF-8' );
		} else {
			return $input;
		}
	}
}
