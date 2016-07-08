<?php
/**
 * Class: Boldgrid_Editor_Media
 *
 * Init processes needed for Editor Media.
 *
 * @since      1.2
 * @package    Boldgrid_Editor
 * @subpackage Boldgrid_Editor_Media
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 */

/**
 * Class: Boldgrid_Editor_Media
 *
 * Init processes needed for Editor Media.
 *
 * @since      1.2
 */
class Boldgrid_Editor_Media {


	/**
	 * Create Tabs based on configurations
	 *
	 * @since 1.0
	 */
	public function create_tabs() {
		$configs = $this->get_tab_configs();
		$tabs = $configs['tabs'];

		// Create each tab specified from the configuraiton.
		foreach ( $tabs as $tab ) {
			$media_tab_class = 'Boldgrid_Editor_Media_Tab';

			if ( isset( $tab['content-class'] ) ) {
				$media_tab_class = $tab['content-class'];
			}

			$tab['is-boldgrid-theme'] = $this->get_is_boldgrid_theme();
			$tab['api_configs'] = array();

			$media_tab = new $media_tab_class( $tab, $this->get_path_configs(), '/' );

			$media_tab->create();
		}
	}
}