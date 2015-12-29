<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package blacksheeplive
 */

?>

	</div><!-- #content -->

<script>var render;</script>

<?php wp_footer(); ?>

<script>
if (!iOS) {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	function onYouTubeIframeAPIReady() {
		if (Modernizr.borderradius ||
			Modernizr.cssanimations ||
			Modernizr.csstransforms ||
			Modernizr.csstransitions ||
			Modernizr.cssvminunit ||
			Modernizr.flexbox ||
			Modernizr.mediaqueries) {
			render();
		}
	}
}
</script>

</body>
</html>
