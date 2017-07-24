<?php
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

return array (
	'ajax_calls' => array (
		'get_plugin_version' =>	'/api/open/get-plugin-version',
		'get_asset'          => '/api/open/get-asset',
		'gridblock_generate' =>	'/v1/gridblocks',
	),
	'asset_server'          => 'https://wp-assets.boldgrid.com',
	'plugin_name'           => 'boldgrid-editor',
	'plugin_key_code'       => 'editor',
	'main_file_path'        => BOLDGRID_EDITOR_PATH . '/boldgrid-editor.php',
	'plugin_transient_name' => 'boldgrid_editor_version_data',
	'allowed_post_types'    => array( 'page', 'post' ),
);
