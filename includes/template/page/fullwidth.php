<?php get_header(); ?>
<div class="entry-content bg-custom-template">
	<?php
	while (have_posts()) : the_post();
	the_content();
	endwhile;
	?>
</div>
<?php get_footer(); ?>
