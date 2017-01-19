<div class="zoom-navbar zoom-navbar-top">
	<div class="history-controls">
		<button class='undo-link' type="button"><i class="mce-ico mce-i-undo"></i></button>
		<button class='redo-link' type="button"><i class="mce-ico mce-i-redo"></i></button>
	</div>
	<div class="bg-zoom-controls">
		<a class="exit-row-dragging">Exit GridBlock Dragging</a>
	</div>
</div>

<script type="text/html" id="tmpl-boldgrid-editor-gridblock">
<div class="gridblock">
	<iframe></iframe>
	<div class='gridblock-html'>{{{data.html}}}</div>
	<div class="add-gridblock"></div>
</div>
</script>

<div class="boldgrid-zoomout-section zoomout-section-2">
	<div class="gridblocks">
	</div>
</div>
<script type="text/html" id="tmpl-gridblock-iframe-styles">
<style>
.centered-section > .row:only-of-type,
.centered-section > .boldgrid-section:only-of-type {
	position: absolute;
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
}
</style>
</script>
