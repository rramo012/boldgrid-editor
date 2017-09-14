<?php get_header(); ?>
<div class="container-fluid">
	<div class="row">
		<div class="col-md-4">
			<?php get_sidebar( $name = null ); ?>
		</div>
		<div class="col-md-8">
		<?php
			while (have_posts()) : the_post();
			the_content();
			endwhile;
		?>
		</div>
	</div>
</div>
<?php get_footer(); ?>
