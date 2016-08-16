<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

$configs = $this->get_configs();

?>
<div class="attachments-browser">
	<?php foreach($configs['route-tabs'] as $tab_name => $tab): ?>
		<?php if ( $tab_name == 'page-layout' || $tab_name == 'basic-gridblocks' || $tab_name == 'static-gridblocks' ) { ?>
			<div class='attachments'  data-tabname='<?php echo $tab_name; ?>'>
			<?php foreach ($tab['content'] as $count => $content): 	?>
				<div class="thumbnail-container attachment" data-html-type='raw' data-id="<?php echo $count; ?>">
					<div class='translate-container attachment-preview'>
						<div class='centered-content-boldgrid container-fluid
							<?php echo get_theme_mod('boldgrid_palette_class', 'palette-primary')?> mce-content-body'>
						<?php echo $content['preview-html']; ?></div>
					</div>
						<a title="Deselect" href="#" class="check">
							<div class="media-modal-icon"></div>
						</a>
				</div>
			<?php endforeach; ?>
			</div>
		<?php } else { ?>
			<ul data-tabname='<?php echo $tab_name; ?>' class="attachments ui-sortable ui-sortable-disabled hidden">
			<?php foreach ($tab['content'] as $count => $content): 	?>
				<li role="checkbox" aria-checked="false"
					data-id="<?php echo $count; ?>" data-html-type='image' class="attachment save-ready">
					<div class="attachment-preview js--select-attachment type-image subtype-jpeg landscape">
					<div class="thumbnail">
						<div class="centered">
							<img draggable="false" src="<?php echo $content['image']; ?>">
						</div>
					</div>
					</div>
					<a title="Deselect" href="#" class="check">
						<div class="media-modal-icon"></div>
					</a>
				</li>
			<?php endforeach; ?>
			</ul>
			<?php } ?>
	<?php endforeach; ?>
	</div>
</div>
