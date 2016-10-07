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
	 * Add styles from theme.
	 */
	public function enqueue_addtional_scripts() {
		$theme_styles = array (
			'theme-style' => "/editor.css",
			'theme-bootstrap' => "/css/bootstrap.min.css"
		);

		// If this is a staged page, use the staged theme
		$directory = get_template_directory();

		$directory_url = get_stylesheet_directory_uri();

		foreach ( $theme_styles as $handle => $theme_style ) {
			if ( file_exists( $directory . $theme_style ) ) {
				wp_enqueue_style( $handle, $directory_url . $theme_style );
			}
		}
	}

	/**
	 * Enqueue Admin Scripts
	 */
	public function enqueue_admin_scripts() {
		add_action( 'admin_enqueue_scripts', array (
			$this,
			'enqueue_header_content'
		) );
	}

	/**
	 * Add theme scripts
	 */
	public function add_theme_scripts() {
		add_action( 'admin_enqueue_scripts', array (
			$this,
			'enqueue_addtional_scripts'
		) );
	}

	/**
	 * Remove a stylesheet from the queue of stylesheets to be loaded and remove its references as
	 * dependencies.
	 * Used instead of wp_deregister_style() because deregister would remove some other needed styles
	 *
	 * @param string $handle
	 */
	public function force_remove_stylesheet( $handle ) {
		global $wp_styles;

		foreach ( $wp_styles->registered as $key => $style ) {

			if ( false == is_object( $style ) ) {
				continue;
			}

			if ( $style->handle == $handle ) {
				$wp_styles->registered[$key] = null;
			} else if ( is_array( $style->deps ) ) {
				$dep_index = array_search( $handle, $style->deps );
				if ( false !== $dep_index ) {
					unset( $style->deps[$dep_index] );
				}
			}
		}
	}

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

			if ( preg_match( '/row(\s|$)/', $classes_attr ) &&
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
	 * Uses the static pages that are created during inspirations and adds the
	 * gridblocks that are found to the configuration which creates the media modal.
	 *
	 * @since 1.0.5
	 */
	public function add_static_gridblocks() {
		$boldgrid_static_pages = get_option( 'boldgrid_static_pages', array () );
		$row_content = array ();

		foreach ( array (
			'pages_in_pageset',
			'additional'
		) as $key ) {
			if ( ! empty( $boldgrid_static_pages['pages'][$key] ) ) {
				foreach ( $boldgrid_static_pages['pages'][$key] as $page ) {
					$row_content = array_merge( $row_content,
						self::parse_gridblocks( $page->code ) );
				}
			}
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
	public function add_existing_layouts() {

		$pages = self::get_all_pages();

		// Grab all rows from all pages.
		$row_content = array ();
		foreach ( $pages as $page ) {
			$row_content = array_merge( $row_content, self::parse_gridblocks( $page->post_content ) );
		}

		return $row_content;
	}

	/**
	 * Enqueue scripts and styles that will allow GridBlocks to inherit theme styles
	 *
	 * @since 1.0.5
	 */
	public function add_scripts_and_styles() {
		// Add the admin scripts and styles
		do_action( 'wp_enqueue_scripts' );
		$this->force_remove_stylesheet( 'wp-admin' );
		$this->add_theme_scripts();
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
	 * Add universal gridblocks to layout configuration
	 *
	 * @since 1.0.5
	 */
	public function add_universal_layouts() {
		// Modify Configs
		$configs = $this->get_configs();

		$row_content = self::get_universal_gridblocks();

		// Modify Configs
		$configs = $this->get_configs();
		$configs['route-tabs']['basic-gridblocks']['content'] = array_merge(
			$configs['route-tabs']['basic-gridblocks']['content'], $row_content );

		$this->set_configs( $configs );
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
	 * Create a tabs content
	 * Modified to add existing layouts from pages
	 */
	public function media_upload_tab_content() {
		$configs = $this->get_configs();

		$this->add_universal_layouts();

		if ( ! empty( $configs['is-boldgrid-theme'] ) ) {
			$current_gridblock_content = $this->add_existing_layouts();

			// Temporarily Disabling Static Gridblocks
			// $static_gridblock_content = $this->add_static_gridblocks();
			$static_gridblock_content = array ();

			$row_content = array_merge( $current_gridblock_content, $static_gridblock_content );
			$row_content = self::cleanup_gridblock_collection( $row_content );

			// Modify Configs
			$configs = $this->get_configs();
			$configs['route-tabs']['basic-gridblocks']['content'] = array_merge(
				$configs['route-tabs']['basic-gridblocks']['content'], $row_content );

			$this->set_configs( $configs );

			// Script Styles
			$this->add_scripts_and_styles();
		}

		wp_enqueue_script( 'boldgrid-existing-layouts',
				plugins_url( Boldgrid_Editor_Assets::get_minified_js( '/assets/js/media/existing-layouts' ),
						BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ), array (), BOLDGRID_EDITOR_VERSION );

		$this->force_remove_stylesheet( 'buttons' );

		$this->enqueue_admin_scripts();

		wp_enqueue_style( 'boldgrid-existing-layouts',
			plugins_url( '/assets/css/bootstrap.min.css',
				BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ), array (
				'media-tab-css-imhwpb'
			), BOLDGRID_EDITOR_VERSION );

		return wp_iframe( array (
			$this,
			'print_content'
		) );
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
