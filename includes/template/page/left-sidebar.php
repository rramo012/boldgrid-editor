<?php get_header(); ?>
<main class="main bg-custom-template container-fluid" role="main">
	<div class="row">
		<div class="col-md-4">
			<?php get_sidebar( $name = null ); ?>
		</div>
		<div class="col-md-8">
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<?php
				the_post();

				if ( Boldgrid_Editor_Service::get( 'page_title' )->has_title_displayed() && get_the_title() ) { ?>
					<header class="container entry-header">
						<h1 class="entry-title"><?php the_title(); ?></h1>
					</header>
				<?php } ?>

				<div class="entry-content">
					<?php the_content(); ?>
				</div>

				<?php include( __DIR__ . '/entry-footer.php' ); ?>
			</article>
		</div>
	</div>
</main>
<?php get_footer(); ?>
