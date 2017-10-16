<?php

$title = 'Edit Post';
$post_type = get_post_type();
if ( $post_type ) {
	$post_type_object = get_post_type_object( $post_type );

	if ( ! empty( $post_type_object->labels->singular_name ) ) {
		$title = 'Edit ' . $post_type_object->labels->singular_name;
	}
}

if ( ! is_customize_preview() ) { ?>
<div class="bg-edit-link">
	<a title="<?php print $title ?>" href="<?php print get_edit_post_link() ?>"><i class="fa fa-pencil"
		aria-hidden="true"></i></a>
</div>
<?php } ?>
