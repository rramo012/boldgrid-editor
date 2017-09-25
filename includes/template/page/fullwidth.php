<?php get_header(); ?>

<div class="bg-custom-template">
<?php
	while ( have_posts() ) {
		the_post();

		if ( Boldgrid_Editor_Service::get( 'page_title' )->has_title_displayed() ) { ?>
			<div class="container entry-header">
				<h1><?php print the_title(); ?></h1>
			</div>
		<?php } ?>

		<div class="entry-content">
			<h1><?php print the_content(); ?></h1>
		</div>
<?php } ?>
</div>

<?php get_footer(); ?>
