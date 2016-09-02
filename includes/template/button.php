<script type="text/html" id="tmpl-boldgrid-editor-button">
	<div class='choices button-design'>
		<div class='title'>
			<h4>Sample Designs</h4>
		</div>
		<div class='presets supports-customization'>
			<ul>
			<# _.each( data.presets, function ( preset ) { #>
				<li data-preset="{{preset.name}}" class="panel-selection">
					<a class='{{preset.name}}'>{{data.text}}</a>
				</li>
			<# }); #>
			</ul>
		</div>
		<div class='customize'>
			<div class='back'>
				<a class='panel-button' href="#"><i class="fa fa-chevron-left" aria-hidden="true"></i> Back</a>
			</div>

		<div class="section button-size-control">
			<h4>Size</h4>
			<div class="slider"></div>
			<span class='value'></span>
		</div>
	</div>
</script>