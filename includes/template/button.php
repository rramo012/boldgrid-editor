<script type="text/html" id="tmpl-boldgrid-editor-button">
	<div class='choices button-design'>
		<div class='presets'>
			<ul>
			<# _.each( data.presets, function ( preset ) { #>
				<li data-preset="{{preset.name}}" class="panel-selection">
					<a class='{{preset.name}}'>{{data.text}}</a>
				</li>
			<# }); #>
			</ul>
		</div>
	</div>
</script>