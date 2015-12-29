<?php
/*
Plugin Name: BlackSheepLive Plugin
Plugin URI: https://blacksheeplive.bbh-labs.com.sg
Description: Adds custom Project post type to be used together with the BBH Labs theme
Version: 0.0.1
Author: BBH Labs team
Author URI: https://bbh-labs.com.sg
License: GPL-2.0
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

/**
 * Custom Post Types
 */
function create_post_type() {
	register_post_type('project',
		array(
			'labels' => array(
				'name' => __('Projects'),
				'singular_name' => __('Project'),
			),
			'supports' => array(
				'title',
				'editor',
				'thumbnail',
				'excerpt',
				'custom-fields',
				'page-attributes',
			),
			'public' => true,
			'has_archive' => true,
			'hierarchical' => true,
		)
	);
	flush_rewrite_rules( false );
}
add_action( 'init', 'create_post_type' );

function projects_on_homepage( $query ) {
	if ( $query->is_home() && $query->is_main_query() ) {
		$query->set( 'posts_per_page', 5 );
	}
}
add_action('pre_get_posts', 'projects_on_homepage');

/**
 * Settings GUI
 */

function bsl_settings_api_init() {
	add_settings_section(
		'bsl_setting_section',
		'BBH Labs Settings',
		'bsl_setting_section_callback_function',
		'general'
	);

	add_settings_field(
		'bsl_setting_name',
		'Some setting that will probably be added later :)',
		'bsl_setting_callback_function',
		'general',
		'bsl_setting_section'
	);

	register_setting( 'general', 'bsl_setting_name' );
}
add_action( 'admin_init', 'bsl_settings_api_init' );

function bsl_setting_section_callback_function() {
	echo '<p>Intro text for our settings section</p>';
}

function bsl_setting_callback_function() {
	echo '<input name="bsl_setting_name" id="bsl_setting_name" type="checkbox" value="1" class="code" ' . checked( 1, get_option( 'bsl_setting_name' ), false ) . ' />';
}


?>
