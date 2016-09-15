<?php
/**
 * Class: Boldgrid_Editor_Builder_Components
 *
 * Parse pages to find component usage.
 *
 * @since      1.3
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Builder_Fonts
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Builder_Components
 *
 * Parse pages to find component usage.
 *
 * @since      1.3
 */
class Boldgrid_Editor_Builder_Components {

	protected static $component_types = array (
		'text' => 'bg-text-fx',
		'box' => 'bg-box',
		'button' => 'btn',
		'image' => 'bg-img'
	);

	public function parse_post( $html ) {
		$components = array();

		$dom = new DOMDocument();

		@$dom->loadHTML( $html );

		$xpath = new DOMXPath( $dom );

		foreach( self::$component_types as $label => $component_ns ) {
			$components[ $label ] = $this->find_component_classes( $xpath, $component_ns );
		}

		$components['font'] = $this->find_fonts( $xpath );

		return $components;
	}

	public function get_components() {
		$components = array();

		$posts = Boldgrid_Layout::get_all_pages();
		foreach( $posts as $post ) {
			$components = array_merge_recursive( $components, $this->parse_post( $post->post_content ) );
		}

		return $components;
	}

	public function find_component_classes( $xpath, $class ) {
		$styles = array();
		$query_string =  sprintf( "//*[contains(concat(' ', normalize-space(@class), ' '), ' %s ')]", $class );
		foreach ( $xpath->query( $query_string ) as $node ) {
			$styles[] = array (
				'classes' => $node->getAttribute('class'),
				'style' => $node->getAttribute('style')
			);
		}
		return $styles;
	}

	public static function find_fonts( $xpath ) {
		$fonts = array();

		foreach ( $xpath->query( "//*[@data-font-family]" ) as $rowNode ) {
			$fonts[] = $rowNode->getAttribute('data-font-family');
		}

		return $fonts;
	}
}