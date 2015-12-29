<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package blacksheeplive
 */

get_header(); ?>
	<div id='root'></div>

	<script type='text/javascript'>
	<?php $args = array(
			'posts_per_page' => 999,
			'post_type' => 'project',
			'post_status' => 'publish',
			'orderby' => 'menu_order',
	);
	$projects_array = get_posts( $args ); ?>

	var projects = [
		<?php if ( is_front_page() && !empty( $projects_array ) ) {
			foreach ($projects_array as $project) {
				echo '{ name: "' . esc_js( $project->post_title ) . '", description: "' . esc_js( $project->post_content ) . '", posterURL: "' . esc_js( get_the_post_thumbnail_url( $project->ID ) ) . '", videoURL: "' . esc_js( get_post_meta( $project->ID, 'Video URL', true ) ) . '" },';
			}
		} ?>
	];

	<?php $menu_array = wp_get_nav_menu_items( 'Main Menu' ); ?>
	var menus = [
		<?php if ( is_front_page()  && !empty( $menu_array )) {
			foreach ($menu_array as $menu) {
				$page = get_page( $menu->object_id );
				echo '{ name: "' . esc_js( $menu->title ) . '", description: ' . json_encode( $page->post_content ) . ' },';
			}
		} ?>
	];
	</script>
<?php
get_footer();
