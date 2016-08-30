<script type="text/html" id="tmpl-boldgrid-editor-image">
	<div class='choices image-design'>
		<div class='title'>
			<h4>Sample Designs</h4>
		</div>
		<div class='presets supports-customization'>
			<ul>
			<# _.each( data.presets, function ( preset ) { #>
				<li data-preset="{{preset}}" class="panel-selection">
					<img class='{{preset}}' src="{{data.src}}">
				</li>
			<# }); #>
			</ul>
		</div>
	</div>
</script>