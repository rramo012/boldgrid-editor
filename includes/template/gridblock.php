<div class="zoom-navbar zoom-navbar-top">
	<div class="history-controls">
		<button class='undo-link' title="Undo" type="button"><i class="mce-ico mce-i-undo"></i></button>
		<button class='redo-link' title="Redo" type="button"><i class="mce-ico mce-i-redo"></i></button>
	</div>
	<div class="bg-zoom-controls">
		<a class="exit-row-dragging">Exit GridBlock Dragging</a>
	</div>
	<div class="loading-remote">
		<div class="enabled bg-editor-loading absolute"></div>
		<span>Loading GridBlocks</span>
	</div>
	<span class="boldgrid-gridblock-categories">
		<label>Gridblock Filters</label>
		<select>
			<option value="all" selected>All Categories</option>
			<option value="call_to_action">Welcome</option>
			<option value="gallery">Gallery</option>
			<option value="team">Team</option>
			<option value="text">Text</option>
			<option value="testimonial">Testimonial</option>
			<option value="about">About</option>
			<option value="services">Services</option>
			<option value="saved">My Gridblocks</option>
		</select>
	</span>
	<a href="#" title="Close" class="bg-close-zoom-view">
		<span class="screen-reader-text">Close</span>
	</a>
</div>
<div class="boldgrid-zoomout-section zoom-gridblocks-section">
	<div class="gridblocks gridblock-loading">
	</div>
</div>

<script type="text/html" id="tmpl-boldgrid-editor-gridblock">
<div class="gridblock gridblock-loading" data-id="{{data.id}}" data-type="{{data.type}}" data-category="{{data.category}}" data-template="{{data.template}}">
	<i class="fa fa-arrows" aria-hidden="true"></i>
	<div class="add-gridblock"></div>
</div>
</script>

<script type="text/html" id="tmpl-boldgrid-editor-gridblock-loading">
	<div class="loading-gridblock">
		<div>Installing Gridblock</div>
		<div class="enabled bg-editor-loading absolute"></div></div>
</script>

<script type="text/html" id="tmpl-gridblock-iframe-styles">
<style>
body, html {
	margin: 0 !important;
	padding: 0 !important;
}

body {
	min-height: 100%;
}

.centered-section > .row:only-of-type,
.centered-section > .boldgrid-section:only-of-type {
	position: absolute;
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
}
</style>
</script>
