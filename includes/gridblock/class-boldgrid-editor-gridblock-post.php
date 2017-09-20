<?php
/**
* Class: Boldgrid_Editor_Gridblock_Post
*
* Manage GridBlock as a custom post type.
*
* @since      1.6
* @package    Boldgrid_Editor
* @subpackage Boldgrid_Editor_Gridblock
* @author     BoldGrid <support@boldgrid.com>
* @link       https://boldgrid.com
*/

/**
 * Class: Boldgrid_Editor_Gridblock_Post
*
* Manage GridBlock as a custom post type.
*
* @since      1.6
*/
class Boldgrid_Editor_Gridblock_Post {

	public function __construct( $configs ) {
		$this->configs = $configs;
	}

	/**
	 * UI Labels.
	 *
	 * @since 1.6
	 *
	 * @return array Labels of the GridBlocks.
	 */
	protected function get_type_labels() {
		return array(
			'name'                => _x( 'GridBlocks', 'Post Type General Name', 'boldgrid-editor' ),
			'singular_name'       => _x( 'GridBlock', 'Post Type Singular Name', 'boldgrid-editor' ),
			'menu_name'           => __( 'GridBlocks', 'boldgrid-editor' ),
			'parent_item_colon'   => __( 'Parent GridBlock', 'boldgrid-editor' ),
			'all_items'           => __( 'All GridBlocks', 'boldgrid-editor' ),
			'view_item'           => __( 'View GridBlocks', 'boldgrid-editor' ),
			'add_new_item'        => __( 'Add New GridBlock', 'boldgrid-editor' ),
			'add_new'             => __( 'Add New', 'boldgrid-editor' ),
			'edit_item'           => __( 'Edit GridBlock', 'boldgrid-editor' ),
			'update_item'         => __( 'Update GridBlock', 'boldgrid-editor' ),
			'search_items'        => __( 'Search GridBlock', 'boldgrid-editor' ),
			'not_found'           => __( 'Not Found', 'boldgrid-editor' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'boldgrid-editor' ),
		);
	}

	/**
	 * Get the arguments used to create the custom post type.
	 *
	 * @since 1.6
	 *
	 * @return array Custom post type args, See: https://codex.wordpress.org/Function_Reference/register_post_type.
	 */
	protected function get_type_args() {
		return array(
			'label'               => __( 'gridblock', 'boldgrid-editor' ),
			'description'         => __( 'My GridBlocks', 'boldgrid-editor' ),
			'labels'              => $this->get_type_labels(),
			'supports'            => array(
				'title',
				'editor',
				// 'author',
				'revisions',
				'custom-fields'
			),
			'taxonomies'          => array( 'gridblock_type' ),
			'hierarchical'        => false,
			'show_ui'             => true,
			// 'show_in_menu'        => false,
			// 'show_in_admin_bar'   => false,
			'menu_position'       => 5,
			'public'              => true,
			// 'query_var'           => true,
			// 'publicly_queryable'  => true,
			'exclude_from_search' => true,
			'capability_type'     => 'page',
		);
	}

	/**
	 * Grab post type args and register the post.
	 *
	 * @since 1.6
	 */
	public function register_post_type() {
		$args = $this->get_type_args();

		// create a new taxonomy
		register_taxonomy(
			'gridblock_type',
			'gridblock',
			array(
				'rewrite' => array( 'slug' => 'gridblocks' ),
				'label' => __( 'GridBlock Types' ),
				'show_admin_column' => true,
				'show_in_menu' => false,
				'show_in_nav_menus' => false,
				'description' => 'ffff'
			)
		);

		// Registering your Custom Post Type
		register_post_type( 'gridblock', $args );
	}

	/**
	 * When viewing a gridblock, set the post type to full width.
	 *
	 * @since 1.6
	 *
	 * @param string $template
	 */
	public function set_template( $template ) {
		global $post;

		if ( $post && 'gridblock' === $post->post_type ) {
			$template = BOLDGRID_EDITOR_PATH . '/includes/template/page/fullwidth.php';
		}

		return $template;
	}

	/**
	* Check the filter we are currently running through and hook in if needed.
	*
	* Reason: This plugin loads in different hooks depending on were it's running from. In admin
	* it runs on init and cannot be added to the init hook. Will not change load order because
	* it may cause some hard to track down bugs.
	*
	* @since 1.6
	*/
	public function add_hooks() {
		if ( 'init' === current_filter() ) {
			$this->register_post_type();
		} else {
			add_action( 'init', array ( $this, 'register_post_type' ) );
		}

		add_action( 'template_include', array( $this, 'set_template' ) );
	}
}
