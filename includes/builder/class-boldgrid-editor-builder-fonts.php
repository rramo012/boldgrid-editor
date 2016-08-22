<?php
/**
 * Class: Boldgrid_Editor_Builder_Fonts
 *
 * Add functionality for fully customizable editor pages.
 *
 * @since      1.3
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Builder_Fonts
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Builder_Fonts
 *
 * Add functionality for fully customizable editor pages.
 *
 * @since      1.3
 */
class Boldgrid_Editor_Builder_Fonts {


	public function print_font_request() {

	}

	public function format_fonts() {

	}

	public function merge_fonts() {

	}

	public function parse_fonts( $html ) {
		$fonts = array();


		$dom = new DOMDocument();

		$xml->loadXml( $html );

		@$dom->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ) );

		$xpath = new DOMXPath( $xml );
		$val = $xpath->query( '//row[@name="title"]' )->item(0)->nodeValue;

		// traverse all results
		foreach ($xpath->query('//row[@name="title"]') as $rowNode) {
			echo $rowNode->nodeValue; // will be 'this item'
		}


		// traverse all results
		foreach ($xpath->query('//row[@name="title"]') as $rowNode) {
			echo $rowNode->nodeValue; // will be 'this item'
		}

		return $fonts;
	}

	public function render_page_fonts() {
		global $post;

		if ( ! empty( $post->post_content ) ) {
			$fonts = $this->parse_fonts( $post->post_content );
			var_dump( $fonts );die;
		}
	}


}