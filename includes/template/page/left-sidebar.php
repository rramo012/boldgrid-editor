<?php get_header(); ?>
<div class="container-fluid bg-custom-template">
	<div class="row">
		<div class="col-md-4">
			<?php get_sidebar( $name = null ); ?>
		</div>
		<div class="col-md-8">
		<?php
			while (have_posts()) : the_post();
				if ( Boldgrid_Editor_Service::get( 'page_title' )->has_title_displayed() ) { ?>
					<div class="entry-header">
						<h1><?php print the_title(); ?></h1>
					</div>
				<?php } ?>

				<div class="entry-content">
					<h1><?php print the_content(); ?></h1>
				</div>
			<?php endwhile; ?>
		</div>
	</div>
</div>
<?php get_footer(); ?>
