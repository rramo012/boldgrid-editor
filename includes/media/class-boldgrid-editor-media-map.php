<?php
/**
 * Class: Boldgrid_Editor_Maps
 *
 * Parse pages to find component usage.
 *
 * @since      1.3
 * @package    Boldgrid_Editor
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Maps
 *
 * Parse pages to find component usage.
 *
 * @since      1.3
 */
class Boldgrid_Editor_Media_Map {

	const DYNAMIC_MAP_VERSION = '1.3';

	public function upgrade_maps() {
		if ( 0 && $this->should_update_maps() ) {
			$pages = Boldgrid_Layout::get_pages_all_status();
			$this->update_pages( $pages );
			$this->save_validated_state();
		}
	}

	/**
	 * On activation save plugin version.
	 *
	 * If the user has no plugin version and the plugin is active we can
	 * assume that this plugin is old and needs updates || plugin version < 1.3.
	 */
	public function should_update_maps() {
		$has_updated_maps = Boldgrid_Editor_Option::get( 'updated_maps' );
		$has_updated_maps = ! empty( $has_updated_maps );

		return false === $has_updated_maps && Boldgrid_Editor_Version::is_version_older( self::DYNAMIC_MAP_VERSION );
	}

	public function save_validated_state() {
		//Boldgrid_Editor_Option::update( 'updated_maps', 1 );
	}

	public function update_pages( $pages ) {

		foreach( $pages as $page ) {
			$this->update_page( $page );
		}
		//die;

	}

	public function replaceElements( $xpath, $dom ) {

		$query_string = '//a[starts-with(@href, "http://maps.google.com/?q")]';
		$updated_content = false;
		foreach ( $xpath->query( $query_string ) as $node ) {
			if ( $node->hasChildNodes() && 1 === sizeof( $node->childNodes ) && 'img' == $node->firstChild->tagName ) {
				$img = $node->firstChild;
				$iframe_html = $this->create_map_iframe( $img );
				if ( $iframe_html ) {
					$updated_content = true;

					$iframe_node = $dom->createDocumentFragment();
					$iframe_node->appendXML( $iframe_html );

					$node->parentNode->replaceChild( $iframe_node, $node );
				}
			}
		}

		return $updated_content;
	}

	public function format_required_vars( $query_vars ) {
		$expected = array( 'zoom' => null, 'center' => null, 'size' => null, 'maptype' => null );
		$formatted = array();
		foreach ( $expected as $param => $val ) {
			if ( ! empty( $query_vars[ $param ] ) ) {
				$formatted[ $param ] = $query_vars[ $param ];
			} else {
				return array();
			}
		}

		return $formatted;
	}

	public function translate_vars( $query_vars ) {
		$alt_api_format = array();
		$alt_api_format = $this->translateZoom( $query_vars, $alt_api_format );
		$alt_api_format = $this->translateLocation( $query_vars, $alt_api_format );
		$alt_api_format = $this->translateType( $query_vars, $alt_api_format );
		$alt_api_format = $this->translateSize( $query_vars, $alt_api_format );

		return $alt_api_format;
	}

	public function translateSize( $query_vars, $alt_api_format ) {
		$size = $query_vars['size'];
		$sizes = explode( 'x', $size );
		$alt_api_format['width'] =  ! empty( $sizes[0] ) ? $sizes[0] : 400;
		$alt_api_format['height'] = ! empty( $sizes[1] ) ? $sizes[1] : 400;

		return $alt_api_format;
	}
	public function translateType( $query_vars, $alt_api_format ) {
		$type = $query_vars['maptype'];
		$map = array(
			'roadmap' => 'm',
			'satellite' => 'k',
			'hybrid' => 'h',
			'terrain' => 'p',
		);

		$alt_api_format['t'] = ! empty( $map[ $type ] ) ? $map[ $type ] : '';

		return $alt_api_format;
	}

	public function translateZoom( $query_vars, $alt_api_format ) {
		$alt_api_format['z'] = $query_vars['zoom'];
		return $alt_api_format;
	}

	public function translateLocation( $query_vars, $alt_api_format ) {
		$alt_api_format['q'] = $query_vars['center'];
		return $alt_api_format;
	}

	public function create_map_iframe( $img ) {
		$src = $img->getAttribute('src');
		$src = "https://maps.googleapis.com/maps/api/staticmap?center=36.8399281%2C-76.082315&maptype=hybrid&zoom=16&size=600x450";
		$parsed_url = parse_url( $src );
		$query_string = ! empty( $parsed_url['query'] ) ? $parsed_url['query'] : '';
		parse_str( $query_string, $query_vars );

		$query_vars = $this->format_required_vars( $query_vars );
		// If all required vars are presnt and the user hasnt added a key.
		$new_node = false;
		if ( ! empty( $query_vars ) && empty( $query_vars['key'] ) ) {
			$alt_api_format = $this->translate_vars( $query_vars );
			$width = $alt_api_format['width'];
			$height = $alt_api_format['height'];
			$alt_api_format['output'] = 'embed';

			unset( $alt_api_format['width'] );
			unset( $alt_api_format['height'] );

			$src_string = http_build_query( $alt_api_format );
			$src_string = urlencode( $src_string );

			$new_node = sprintf(
				'<iframe class="boldgrid-google-maps" src="https://maps.google.com/maps?%s" style="border:0" width="%s" height="%s" frameborder="0"></iframe>',
				$src_string, $width, $height );
		}

		return $new_node;
	}

	public function update_page( $page ) {
		$content = ! empty( $page->post_content ) ? $page->post_content : '';
		$dom = new DOMDocument();
		@$dom->loadHTML( Boldgrid_Layout::utf8_to_html( $content ) );
		$xpath = new DOMXPath( $dom );

		if ( $this->replaceElements( $xpath, $dom ) ) {
			echo $dom->saveXml($dom->documentElement);
			die;
			//Save Changes
		}

	}
}