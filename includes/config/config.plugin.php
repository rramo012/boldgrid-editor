<?php
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

return array (
	'ajax_calls' => array (
		'get_plugin_version' => '/api/open/get-plugin-version',
		'get_asset'          => '/api/open/get-asset',
		'gridblock_generate' => '/v1/gridblocks',
		'gridblock_types'    => '/v1/gridblocks/types'
	),
	'asset_server'          => 'https://wp-assets.boldgrid.com',
	'plugin_name'           => 'boldgrid-editor',
	'plugin_key_code'       => 'editor',
	'urls' => array(
		'premium_key' => 'https://www.boldgrid.com/connect-keys'
	),
	'main_file_path'        => BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php',
	'plugin_transient_name' => 'boldgrid_editor_version_data',
	'allowed_post_types'    => array( 'page', 'post', 'gridblock' ),
	'controls'              => array(
		'page_title' => array(
			'visible_by_default' => false
		)
	),
	'conflicting_assets'	=> array(
		'boldgrid-components' => array(
			'handle' => 'boldgrid-components',
			'deps' => array(),
			'version' => '2.5.1',
			'src' => plugins_url( '/assets/css/components.min.css', BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ),
			'mce_str_match' => '/components.',
		),
		'font-awesome' => array(
			'handle' => 'font-awesome',
			'deps' => array(),
			'version' => '4.7',
			'src' => plugins_url( '/assets/css/font-awesome.min.css', BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php' ),
			'mce_str_match' => '/font-awesome.',
		),
	),
	'widget' => array(
		'areas' => array(
			'boldgrid-editor-sidebar' => array(
				'name' => __( 'BoldGrid Editor Sidebar', 'boldgrid-editor' ),
				'id' => 'boldgrid-editor-sidebar',
				'description' => __( 'Widgets in this area will on BoldGrid Editor templates.', 'boldgrid-editor' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h2 class="widget-title">',
				'after_title'   => '</h2>',
			)
		)
	)
);
