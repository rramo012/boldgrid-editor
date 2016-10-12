<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

return array (
	'tabs' => array (
		'insert-layout' => array (
			'tab-details' => array (
				'type' => 'html',
				'selection-type' => 'single-item'
			), // multi-select
			'title' => 'Insert GridBlock',
			'content-class' => 'Boldgrid_Layout',
			'slug' => 'insert_layout',
			'attachments-template' => BOLDGRID_EDITOR_PATH . '/pages/standard-attachments.php',
			'sidebar-template' => BOLDGRID_EDITOR_PATH . '/pages/standard-sidebar.php',
			'route-tabs' => array (
				'basic-gridblocks' => array (
					'name' => 'GridBlock Library',
					'content' => array ()
				),
				'static-gridblocks' => array (
					'name' => 'Inspiration GridBlocks',
					'content' => array ()
				),
				'page-layout' => array (
					'name' => 'Current GridBlocks',
					'content' => array ()
				),
				'basic-image-gridblocks' => array (
					'name' => 'Basic Image GridBlocks',
					'content' => array (
					)
				),
				'basic-text-gridblocks' => array (
					'name' => 'Basic Text GridBlocks',
					'content' => array (
					)
				),
				'button-layout' => array (
					'name' => 'Basic Button GridBlocks',
					'content' => array ()
				),
				'icon-layout' => array (
					'name' => 'Basic Icon GridBlocks',
					'content' => array ()
				),
			)
		),
		'google-map' => array (
			'tab-details' => array (
				'type' => 'api',
				'selection-type' => 'single-item',
				'base-url' => 'https://maps.google.com/maps',
				'default-location-setting' => array (
					'q' => 'New York, NY'
				)
			),
			'title' => 'Google Map',
			'zoom' => '14',
			'slug' => 'google_map',
			'attachments-template' => BOLDGRID_EDITOR_PATH . '/pages/standard-attachments.php',
			'sidebar-template' => BOLDGRID_EDITOR_PATH . '/pages/google-maps-sidebar.html',
			'route-tabs' => array (
				'map-view' => array (
					'name' => 'Map View',
					'content' => array (
						array (
							'image' => plugins_url( '/assets/image/maps/google/gm-roadmap.png',
								BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ),
							'map-params' => array (
								// Type: Standard.
								't' => 'm',
								// Zoom.
								'z' => '16'
							)
						),
						array (
							'image' => plugins_url( '/assets/image/maps/google/gm-satellite.png',
								BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ),
							'map-params' => array (
								// Satellite.
								't' => 'k',
								'z' => '16'
							)
						)
					)
				)
			)
		)
	)
);
