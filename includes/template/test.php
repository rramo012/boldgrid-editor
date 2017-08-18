<style>
.page-template-templatetest-php.page-template-test #content.site-content {
	margin-top: 0;
	margin-bottom: 0;
	padding: 0;
}
.page-template-templatetest-php.page-template-test .site-footer {
	margin-top: 0;
}

.page-template-templatetest-php.page-template-test header {
	margin-bottom: 0;
}

</style>

<?php get_header(); ?>
<?php
while (have_posts()) : the_post();
the_content();
endwhile;
?>
<?php get_footer(); ?>
