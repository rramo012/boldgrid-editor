<?php
if ( ! defined( 'WPINC' ) ) {
	die();
}
?>

<div class="media-sidebar visible">
	<div class='hidden'>
		<h3>Details</h3>
		<img alt="" class='fullwidth-imhwpb' draggable="false" src="">
		<div
			class='boldgrid-markup-container <?php echo get_theme_mod('boldgrid_palette_class', 'palette-primary')?> mce-content-body'>
			<div class="centered-content-boldgrid "></div>
		</div>
	</div>
	<div class='boldgrid-loading-graphic'>
		<img src="<?php echo plugins_url( '/assets/image/bg-logo.svg',$path_configs['plugin_filename'] ) ?>"
			alt="BoldGrid logo">
		<h4 class='loading-help-text'><?php echo __( 'Loading Gridblocks', 'boldgrid-editor' ); ?></h4>
		<div class='loading-bar-wrap'>
			<div class="loading-bar"></div>
		</div>
	</div>
</div>